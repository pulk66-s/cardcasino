import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseController } from './case.controller';
import { CaseService } from './case.service';
import { CaseEntity } from './entities/case.entity';
import { CaseStorageService } from './services/case-storage.service';
import { CardEntity } from '../card/entities/card.entity';
import { UserEntity } from '../user/user.entity';
import { CardStorageService } from '../card/services/card-storage.service';

@Module({
    imports: [TypeOrmModule.forFeature([CaseEntity, CardEntity, UserEntity])],
    controllers: [CaseController],
    providers: [CaseService, CaseStorageService, CardStorageService],
    exports: [CaseService, CaseStorageService],
})
export class CaseModule {}
