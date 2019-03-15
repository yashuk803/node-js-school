import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsDateString } from 'class-validator';
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
    @IsDateString()
    date: Date;

    @ManyToOne(type => User, user => user.books, {
        cascade: true
    })
    user: User;
}
