import { Injectable } from "@nestjs/common";
import { DefaultService } from "src/common/services/default-log.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { Result } from "oxide.ts";
import { UserEntity } from "../user.entity";
import { Exception } from "src/utils/exception";
import { UserStorageService } from "./user-storage.service";

@Injectable()
export class UserService extends DefaultService {
    public constructor(
        private storage: UserStorageService,
    ) {
        super(UserService.name);
    }

    public async register(dto: CreateUserDto): Promise<Result<UserEntity, Exception>> {
        return this.storage.saveOne(new UserEntity({
            login: dto.login,
            password: dto.password,
            email: dto.email
        }));
    }
}
