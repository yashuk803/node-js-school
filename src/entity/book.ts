import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsDate } from 'class-validator';
import { User } from './user';

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    @IsDate()
    date: Date;

    @ManyToOne(type => User, user => user.books, {
        cascade: true
    })
    user: User;
}
