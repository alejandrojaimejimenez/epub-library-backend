import request from 'supertest';
import app from '@presentation/http/app';
import { setupTestDb, cleanupTestDb } from '../../../setupTestDb';
import path from 'path';
import fs from 'fs';

let authToken: string;

beforeAll(async () => {
  setupTestDb();
  // Registra y loguea un usuario para obtener un token válido
  const registerRes = await request(app)
    .post('/api/v1/auth/register')
    .send({ username: 'booktest', email: 'booktest@example.com', password: 'test1234' });
  // Depuración: mostrar respuesta de registro
  // eslint-disable-next-line no-console
  console.log('REGISTER', registerRes.status, registerRes.body);
  expect([200, 201]).toContain(registerRes.status);

  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ username: 'booktest', password: 'test1234' });
  // Depuración: mostrar respuesta de login
  // eslint-disable-next-line no-console
  console.log('LOGIN', loginRes.status, loginRes.body);
  expect(loginRes.status).toBe(200);
  authToken = loginRes.body.token;
});

afterAll(() => {
  // Cerrar conexiones a la base de datos antes de limpiar archivos
  try {
    const { closeUsersDatabase } = require('@utils/usersDatabase');
    closeUsersDatabase && closeUsersDatabase();
  } catch (e) {
    // Ignorar si no existe
  }
  cleanupTestDb();
});

describe('Books API', () => {
  let firstBookId: number | undefined;

  it('GET /api/v1/books debe devolver lista de libros', async () => {
    const res = await request(app)
      .get('/api/v1/books')
      .set('Authorization', `Bearer ${authToken}`);
    // Depuración: mostrar respuesta real
    // eslint-disable-next-line no-console
    console.log('BOOKS RESPONSE', res.status, res.body);
    expect(res.status).toBe(200);
    // Ajustar la aserción según la estructura real
    let booksArr: any[] = [];
    if (Array.isArray(res.body)) {
      booksArr = res.body;
    } else if (res.body && Array.isArray(res.body.books)) {
      booksArr = res.body.books;
    } else if (res.body && Array.isArray(res.body.data)) {
      booksArr = res.body.data;
    } else {
      throw new Error('La respuesta no contiene un array de libros');
    }
    expect(Array.isArray(booksArr)).toBe(true);
    expect(booksArr.length).toBeGreaterThan(0);
    firstBookId = booksArr[0].id;
  });

  it('GET /api/v1/books/:id debe devolver un libro por id', async () => {
    if (!firstBookId) throw new Error('No hay libros para testear');
    const res = await request(app)
      .get(`/api/v1/books/${firstBookId}`)
      .set('Authorization', `Bearer ${authToken}`);
    // Depuración: mostrar respuesta real
    // eslint-disable-next-line no-console
    console.log('BOOK BY ID RESPONSE', res.status, res.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id', firstBookId);
    expect(res.body.data).toHaveProperty('title');
  });

  it('GET /api/v1/books/:id con id inexistente debe devolver 404', async () => {
    const res = await request(app)
      .get('/api/v1/books/99999')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
  });

  it('GET /api/v1/books sin token debe devolver 401', async () => {
    const res = await request(app)
      .get('/api/v1/books');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/books/:id/epub debe descargar el archivo EPUB', async () => {
    // Buscar un libro que tenga un archivo EPUB real
    const resBooks = await request(app)
      .get('/api/v1/books')
      .set('Authorization', `Bearer ${authToken}`);
    let booksArr: any[] = [];
    if (Array.isArray(resBooks.body)) {
      booksArr = resBooks.body;
    } else if (resBooks.body && Array.isArray(resBooks.body.books)) {
      booksArr = resBooks.body.books;
    } else if (resBooks.body && Array.isArray(resBooks.body.data)) {
      booksArr = resBooks.body.data;
    } else {
      throw new Error('La respuesta no contiene un array de libros');
    }
    // Buscar el primer libro con un EPUB real en la estructura de carpetas
    const config = require('@config/index').default;
    const booksPath = config.booksPath;
    const fs = require('fs');
    const path = require('path');
    let bookWithEpub: any = null;
    for (const book of booksArr) {
      // Buscar carpeta que termine con (id)
      let found = false;
      const authorDirs = fs.readdirSync(booksPath);
      for (const authorDir of authorDirs) {
        const authorPath = path.join(booksPath, authorDir);
        if (!fs.statSync(authorPath).isDirectory()) continue;
        const bookDirs = fs.readdirSync(authorPath);
        for (const bookDir of bookDirs) {
          if (bookDir.endsWith(`(${book.id})`)) {
            const bookFolder = path.join(authorPath, bookDir);
            const files = fs.readdirSync(bookFolder);
            const epubFile = files.find((f: string) => f.endsWith('.epub'));
            if (epubFile) {
              bookWithEpub = book;
              found = true;
              break;
            }
          }
        }
        if (found) break;
      }
      if (bookWithEpub) break;
    }
    expect(bookWithEpub).toBeTruthy();
    const res = await request(app)
      .get(`/api/v1/books/${bookWithEpub.id}/epub`)
      .set('Authorization', `Bearer ${authToken}`)
      .buffer()
      .parse((res, callback) => {
        const data: Uint8Array[] = [];
        res.on('data', chunk => data.push(chunk));
        res.on('end', () => callback(null, Buffer.concat(data)));
      })
      .expect('Content-Type', /epub\+zip/)
      .expect(200);
    expect(Buffer.isBuffer(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(1024);
  });
});
