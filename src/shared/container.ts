import { container } from 'tsyringe';
import { IUserRepository } from '@repositories/IUserRepository';
import { UserRepository } from '@infrastructure/db/repositories/UserRepository';
import { IAuthorRepository } from '@repositories/IAuthorRepository';
import { AuthorRepository } from '@infrastructure/db/repositories/AuthorRepository';
import { IBookReadRepository } from '@repositories/IBookReadRepository';
import { BookRepository } from '@infrastructure/db/repositories/BookRepository';
import { ITagRepository } from '@repositories/ITagRepository';
import { TagRepository } from '@infrastructure/db/repositories/TagRepository';

container.registerSingleton<IUserRepository>('IUserRepository', UserRepository);
container.registerSingleton<IAuthorRepository>('IAuthorRepository', AuthorRepository);
container.registerSingleton<IBookReadRepository>('IBookReadRepository', BookRepository);
container.registerSingleton<ITagRepository>('ITagRepository', TagRepository);

export { container };
