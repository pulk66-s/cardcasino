
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserRights } from '../user.entity';
import { Option, Some, None, Result, Ok, Err } from 'oxide.ts';
import { DefaultStorageService } from 'src/common/services/default-storage.service';

@Injectable()
export class UserStorageService extends DefaultStorageService<UserEntity> {
    constructor(
        @InjectRepository(UserEntity)
        repository: Repository<UserEntity>,
    ) {
        super(UserStorageService.name, repository);
    }
}
