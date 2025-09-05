import { HttpStatus, Injectable } from '@nestjs/common';
import { UserStorageService } from './user-storage.service';
import { Option, Result, Some, None, Ok, Err } from 'oxide.ts';
import { UserEntity } from '../user.entity';
import { Exception } from 'src/utils/exception';

@Injectable()
export class UserLoginService {
  constructor(private readonly userStorage: UserStorageService) { }

  public async login(login: string, password: string): Promise<Result<UserEntity, Exception>> {
    const res = await this.userStorage.findOne({
      where: {
        login, password
      }
    });
    if (res.isErr()) return Err(res.unwrapErr());
    if (res.unwrap().isNone()) return Err(new Exception(HttpStatus.BAD_REQUEST, ["Bad request"]))
    return Ok(res.unwrap().unwrap())
  }
}
