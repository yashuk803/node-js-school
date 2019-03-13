import { BaseContext } from 'koa';
import { dateformat } from 'dateformat';
import { getManager, Repository, Not, Equal } from 'typeorm';
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

        // return OK status code and loaded user object
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
        bookToBeSaved.date = ctx.request.body.date || dateformat(new Date(), 'yyyy-mm-dd');
        bookToBeSaved.user = ctx.params.id;

        if(! await userRepository.findOne({ id: ctx.params.id}) ) {
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
}
