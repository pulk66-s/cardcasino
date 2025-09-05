import { CaseRarity } from "../entities/case.entity";

export class CreateCaseRequestDto {
    name: string;
    description: string;
    price: number;
    rarity: CaseRarity;
    possibleCards: string[];
    cardWeights: number[];
}
