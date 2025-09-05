import { DefaultEntity } from "src/common/entities/default.entity";
import { Column, Entity } from "typeorm";

export enum CaseRarity {
    COMMON = "COMMON",
    RARE = "RARE", 
    EPIC = "EPIC",
    LEGENDARY = "LEGENDARY"
}

@Entity('cases')
export class CaseEntity extends DefaultEntity {
    public constructor() {
        super()
    }

    @Column({
        type: 'varchar',
        unique: true,
        nullable: false,
    })
    name: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: false,
    })
    price: number;

    @Column({
        type: "enum",
        enum: CaseRarity,
        default: CaseRarity.COMMON
    })
    rarity: CaseRarity;

    @Column({
        type: 'simple-array',
        nullable: false,
    })
    possibleCards: string[]; // Array of card names that can be obtained

    @Column({
        type: 'simple-array',
        nullable: false,
    })
    cardWeights: number[]; // Corresponding weights for each card (higher = more likely)
}
