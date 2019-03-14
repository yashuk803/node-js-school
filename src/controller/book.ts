import { BaseContext } from 'koa';
import { getManager, Repository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { User } from '../entity/user';
import { Book } from '../entity/book';

export default class BookController {

    public static async getUserBooks (ctx: BaseContext) {

        const userRepository: Repository<User> = getManager().getRepository(User);
        const userBooks: User = await userRepository.findOne(
            {id: ctx.params.id || 0},
            {relations: ['books']});

        if (!userBooks) {
            ctx.status = 400;
            ctx.body = 'The user\'s doesn\'t exit in the db';
            return;
        }

        ctx.status = 200;
        ctx.body = userBooks;

    }
    public static async createUserBook (ctx: BaseContext) {

        const userRepository: Repository<User> = getManager().getRepository(User);

        const bookRepository: Repository<Book> = getManager().getRepository(Book);
        // build up entity book to be saved
        const bookToBeSaved: Book = new Book();
        bookToBeSaved.name = ctx.request.body.name;
        bookToBeSaved.description = ctx.request.body.description;
        bookToBeSaved.date = ctx.request.body.date || new Date();
        bookToBeSaved.user = ctx.params.id;

        const errors: ValidationError[] = await validate(bookToBeSaved);

        if (errors.length > 0) {

            ctx.status = 400;
            ctx.body = errors;
        } else if(! await userRepository.findOne({ id: ctx.params.id}) ) {
            ctx.status = 400;
            ctx.body = 'This user doesn\'t in db ';
        } else if ( await bookRepository.findOne({ name: bookToBeSaved.name}) ) {

            ctx.status = 400;
            ctx.body = 'This book already exit ';

        } else {

            const book = await bookRepository.save(bookToBeSaved);
            ctx.status = 201;
            ctx.body = book;
        }
    }

    public static async updateUserBook (ctx: BaseContext) {

        const bookRepository: Repository<Book> = getManager().getRepository(Book);

        const bookUser = await bookRepository.findOne({ id: ctx.params.id  , user: ctx.params.userId});

        ctx.body = bookUser;
        if (!bookUser) {
            ctx.status = 400;
            ctx.body = 'The user and book doesn\'t exist in the db';
            return;
        }

        const bookToBeUpdated: Book = new Book();
        bookToBeUpdated.id = bookUser.id;
        bookToBeUpdated.name = ctx.request.body.name;
        bookToBeUpdated.description = ctx.request.body.description;
        bookToBeUpdated.date = ctx.request.body.date || new Date();
        bookToBeUpdated.user = ctx.params.userId;

        if ( !await bookRepository.findOne(bookToBeUpdated.id) ) {

            ctx.status = 400;
            ctx.body = 'The book you are trying to update doesn\'t exist in the db';

        } else {

            const user = await bookRepository.save(bookToBeUpdated);

            ctx.status = 201;
            ctx.body = user;
        }
    }

    public static async deleteUserBook (ctx: BaseContext) {

        const bookRepository: Repository<Book> = getManager().getRepository(Book);

        const bookToRemove: Book = await bookRepository.findOne(
            {id: ctx.params.id || 0});

        if ( !bookToRemove ) {
            ctx.status = 400;
            ctx.body = 'The book you are trying to delete doesn\'t exist in the db';
            return;
        } else if ( bookToRemove.id !== ctx.params.userId ) {
            ctx.status = 400;
            ctx.body = 'This user haven\'t this book';
        }

        await bookRepository.remove(bookToRemove);
        ctx.status = 204;
    }
}
