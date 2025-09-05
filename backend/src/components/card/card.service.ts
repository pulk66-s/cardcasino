import { Injectable } from '@nestjs/common';
import { CardStorageService } from './services/card-storage.service';
import { CardEntity } from './entities/card.entity';

@Injectable()
export class CardService {
    constructor(
        private readonly cardStorage: CardStorageService,
    ) { }
}
