import { Injectable } from "@nestjs/common";
import { DefaultStorageService } from "src/common/services/default-storage.service";
import { CardEntity } from "../entities/card.entity";

@Injectable()
export class CardStorageService extends DefaultStorageService<CardEntity> {
    
}