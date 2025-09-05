
import { DefaultEntity } from 'src/common/entities/default.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { CardEntity } from '../card/entities/card.entity';
import { GameInstanceEntity } from '../game/game-instance.entity';

export enum UserRights {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export interface UserEntityInterface {
    login: string;
    password: string;
    email: string
}

@Entity('users')
export class UserEntity extends DefaultEntity {
    public constructor(data: UserEntityInterface) {
        super();
        Object.assign(this, data);
    }

    @Column({ unique: true })
    login: string;

    @Column({ unique: true })
    email: string

    @Column()
    password: string;

    @Column({ type: 'enum', enum: UserRights, default: UserRights.USER })
    rights: UserRights;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 100.00 })
    balance: number;

    @OneToMany(() => CardEntity, card => card.user)
    cards: CardEntity[];

    @ManyToMany(() => GameInstanceEntity, game => game.users)
    game_instances: GameInstanceEntity[]
}
