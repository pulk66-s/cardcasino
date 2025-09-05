

import { PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, BaseEntity } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export abstract class DefaultEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;
}
