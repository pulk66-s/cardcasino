import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user.entity';
import { Option, Some, None } from 'oxide.ts';

@Injectable()
export class UserRightService {
  hasRight(user: UserEntity, right: string): boolean {
    return user.rights === right;
  }

  getRights(user: UserEntity): Option<string> {
    return user.rights ? Some(user.rights) : None;
  }
}
