import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { UserService } from "./services/user.service";
import { UserStorageService } from "./services/user-storage.service";
import { UserLoginService } from "./services/user-login.service";
import { UserRightService } from "./services/user-right.service";
import { UserController } from "./user.controller";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UserService, UserStorageService, UserLoginService, UserRightService],
    controllers: [UserController]
})
export class UserModule { }
