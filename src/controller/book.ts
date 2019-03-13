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

    public static async updateUserBook (ctx: BaseContext) {

        const bookRepository: Repository<Book> = getManager().getRepository(Book);

        const bookUser = await bookRepository.createQueryBuilder('book')
            .leftJoinAndSelect('book.user', 'user')
            .where('user.id = :userId', { userId: ctx.params.userId || 0 })
            .andWhere('book.id = :id', { id: ctx.params.id || 0 })
            .getOne();

        if (!bookUser) {
            ctx.status = 400;
            ctx.body = 'The user and book doesn\'t exist in the db';
            return;
        }

        const bookToBeUpdated: Book = new Book();
        bookToBeUpdated.id = bookUser.id;
        bookToBeUpdated.name = ctx.request.body.name;
        bookToBeUpdated.description = ctx.request.body.description;
        bookToBeUpdated.date = ctx.request.body.date || dateformat(new Date(), 'yyyy-mm-dd');
        bookToBeUpdated.user = ctx.params.id;


        if ( !await bookRepository.findOne(bookToBeUpdated.id) ) {
            ctx.status = 400;
            ctx.body = 'The book you are trying to update doesn\'t exist in the db';
        } else if ( await bookRepository.findOne({ id: Not(Equal(bookToBeUpdated.id)) , name: bookToBeUpdated.name}) ) {

            ctx.status = 400;
            ctx.body = 'The specified book\'s name already exists';
        } else {

            const user = await bookRepository.save(bookToBeUpdated);

            ctx.status = 201;
            ctx.body = user;
        }
    }

    public static async deleteUser (ctx: BaseContext) {

        // get a user repository to perform operations with user
        const userRepository = getManager().getRepository(User);

        // find the user by specified id
        const userToRemove: User = await userRepository.findOne(+ctx.params.id || 0);
        if (!userToRemove) {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = 'The user you are trying to delete doesn\'t exist in the db';
        } else if (+ctx.state.user.id !== userToRemove.id) {
            // check user's token id and user id are the same
            // if not, return a FORBIDDEN status code and error message
            ctx.status = 403;
            ctx.body = 'A user can only be deleted by himself';
        } else {
            // the user is there so can be removed
            await userRepository.remove(userToRemove);
            // return a NO CONTENT status code
            ctx.status = 204;
        }
    }
}
