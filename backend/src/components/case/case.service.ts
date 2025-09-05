import { Injectable, HttpStatus } from '@nestjs/common';
import { CaseStorageService } from './services/case-storage.service';
import { CaseEntity } from './entities/case.entity';
import { UserEntity } from '../user/user.entity';
import { CardEntity, CardStatus } from '../card/entities/card.entity';
import { CardStorageService } from '../card/services/card-storage.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exception } from 'src/utils/exception';
import { Err, Ok, Result } from 'oxide.ts';
import { OpenCaseResponseDto } from './dto/open-case-response.dto';
import { CaseResponseDto } from './dto/case-response.dto';

@Injectable()
export class CaseService {
    constructor(
        private readonly caseStorage: CaseStorageService,
        private readonly cardStorage: CardStorageService,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(CardEntity)
        private readonly cardRepository: Repository<CardEntity>,
    ) { }

    /**
     * Get all available cases
     */
    async getAllCases(): Promise<Result<CaseResponseDto[], Exception>> {
        const casesResult = await this.caseStorage.findMany({});
        
        if (casesResult.isErr()) {
            return Err(casesResult.unwrapErr());
        }

        const cases = casesResult.unwrap();
        const caseResponses = cases.map(caseEntity => new CaseResponseDto(caseEntity));
        
        return Ok(caseResponses);
    }

    /**
     * Open a case for a user
     */
    async openCase(caseUuid: string, user: UserEntity): Promise<Result<OpenCaseResponseDto, Exception>> {
        // Find the case
        const caseResult = await this.caseStorage.findOne({ where: { uuid: caseUuid } });
        
        if (caseResult.isErr()) {
            return Err(caseResult.unwrapErr());
        }

        const caseOption = caseResult.unwrap();
        if (caseOption.isNone()) {
            return Err(new Exception(HttpStatus.NOT_FOUND, ['Case not found']));
        }

        const caseEntity = caseOption.unwrap();

        // Check if user has enough balance
        if (user.balance < caseEntity.price) {
            return Ok(new OpenCaseResponseDto(
                false,
                '',
                user.balance,
                'Insufficient balance'
            ));
        }

        // Deduct the price from user's balance
        user.balance = Number(user.balance) - Number(caseEntity.price);
        await this.userRepository.save(user);

        // Get a random card from the case
        const randomCard = this.getRandomCardFromCase(caseEntity);

        // Create the card for the user
        const newCard = new CardEntity();
        newCard.name = randomCard;
        newCard.status = CardStatus.RECEIVED;
        newCard.user = user;

        await this.cardRepository.save(newCard);

        return Ok(new OpenCaseResponseDto(
            true,
            randomCard,
            user.balance,
            'Case opened successfully!'
        ));
    }

    /**
     * Get a random card from a case based on weights
     */
    private getRandomCardFromCase(caseEntity: CaseEntity): string {
        const { possibleCards, cardWeights } = caseEntity;
        
        // Calculate total weight
        const totalWeight = cardWeights.reduce((sum, weight) => sum + weight, 0);
        
        // Generate random number
        const random = Math.random() * totalWeight;
        
        // Find the selected card
        let currentWeight = 0;
        for (let i = 0; i < possibleCards.length; i++) {
            currentWeight += cardWeights[i];
            if (random <= currentWeight) {
                return possibleCards[i];
            }
        }
        
        // Fallback (shouldn't happen)
        return possibleCards[0];
    }

    /**
     * Create a new case (admin only)
     */
    async createCase(
        name: string,
        description: string,
        price: number,
        rarity: string,
        possibleCards: string[],
        cardWeights: number[]
    ): Promise<Result<CaseEntity, Exception>> {
        const newCase = new CaseEntity();
        newCase.name = name;
        newCase.description = description;
        newCase.price = price;
        newCase.rarity = rarity as any;
        newCase.possibleCards = possibleCards;
        newCase.cardWeights = cardWeights;

        return await this.caseStorage.saveOne(newCase);
    }
}
