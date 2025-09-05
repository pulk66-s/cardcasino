import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CardEntity } from "./entities/card.entity";
import { CardService } from "./card.service";
import { CardStorageService } from "./services/card-storage.service";
import { CardController } from "./card.controller";

@Module({
    imports: [TypeOrmModule.forFeature([CardEntity])],
    providers: [CardService, CardStorageService],
    controllers: [CardController]
})
export class CardModule {}
