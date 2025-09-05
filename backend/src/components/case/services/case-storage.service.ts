import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DefaultStorageService } from "src/common/services/default-storage.service";
import { CaseEntity } from "../entities/case.entity";

@Injectable()
export class CaseStorageService extends DefaultStorageService<CaseEntity> {
    constructor(
        @InjectRepository(CaseEntity)
        private readonly caseRepository: Repository<CaseEntity>,
    ) {
        super('Case', caseRepository);
    }
}
