import { DefaultEntity } from "src/common/entities/default.entity";
import { UserEntity } from "src/components/user/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

export enum CardStatus {
    RECEIVED = "RECEIVED",
    NOT_RECEIVED = "NOT_RECEIVED"
}

@Entity('cards')
export class CardEntity extends DefaultEntity {
    public constructor() {
        super()
    }

    @Column({
        type: 'varchar',
        unique: true,
        nullable: false,
    })
    name: string

    @Column({
        type: "enum",
        enum: CardStatus,
    })
    status: CardStatus;

    @ManyToOne(() => UserEntity, user => user.cards, { nullable: false })
    user: UserEntity;
}

