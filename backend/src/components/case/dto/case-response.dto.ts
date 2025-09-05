import { CaseEntity } from "../entities/case.entity";

export class CaseResponseDto {
    uuid: string;
    name: string;
    description: string;
    price: number;
    rarity: string;
    possibleCards: string[];

    constructor(caseEntity: CaseEntity) {
        this.uuid = caseEntity.uuid;
        this.name = caseEntity.name;
        this.description = caseEntity.description;
        this.price = caseEntity.price;
        this.rarity = caseEntity.rarity;
        this.possibleCards = caseEntity.possibleCards;
    }
}
