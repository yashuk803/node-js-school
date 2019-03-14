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

        ctx.status = 200;
        ctx.body = userBooks;

    }
}
