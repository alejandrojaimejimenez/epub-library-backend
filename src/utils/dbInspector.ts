import { getDatabase } from '../utils/database';

// Definición de tipos para las respuestas de SQLite
interface TableInfo {
  name: string;
}

interface ColumnInfo {
  name: string;
  type: string;
  pk: number;
  notnull: number;
  dflt_value: string | null;
}

// Script para obtener la estructura de la base de datos
try {
  const db = getDatabase();
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;").all() as TableInfo[];
  
  console.log('Tablas en la base de datos:');
  console.log(tables.map(t => t.name).join('\n'));

  // Para cada tabla, mostrar su estructura
  for (const table of tables) {
    const tableName = table.name;
    console.log(`\nEstructura de la tabla ${tableName}:`);
    const columns = db.prepare(`PRAGMA table_info(${tableName});`).all() as ColumnInfo[];
    
    columns.forEach(col => {
      console.log(`  ${col.name} (${col.type})${col.pk ? ' PRIMARY KEY' : ''}${col.notnull ? ' NOT NULL' : ''}`);
    });
  }
} catch (error) {
  console.error('Error al inspeccionar la base de datos:', error);
}
