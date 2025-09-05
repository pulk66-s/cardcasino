
import { Controller, Get, Post, Body, Param, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserStorageService } from './services/user-storage.service';
import { UserLoginService } from './services/user-login.service';
import { UserRightService } from './services/user-right.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserRightResponseDto } from './dto/user-right-response.dto';
import { UserService } from './services/user.service';
import { UserEntity } from './user.entity';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService,
        private userLoginService: UserLoginService
    ) { }

    @Post('register')
    async register(@Body() dto: CreateUserDto): Promise<{ token: string, user: UserResponseDto }> {
        const res = await this.userService.register(dto);
        if (res.isErr())
            throw res.unwrapErr();
        const user = res.unwrap();
        // Replace 'your_jwt_secret' with your actual secret
        const token = jwt.sign({ uuid: user.uuid, login: user.login }, 'your_jwt_secret', { expiresIn: '1h' });
        return { token, user };
    }

    @Post('login')
    async login(@Body() dto: LoginUserDto): Promise<{ token: string, user: UserEntity }> {
        const res = await this.userLoginService.login(dto.login, dto.password);
        if (res.isErr()) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const user = res.unwrap();
        const token = jwt.sign({ uuid: user.uuid, login: user.login }, 'your_jwt_secret', { expiresIn: '1h' });
        return { token, user };
    }
}
