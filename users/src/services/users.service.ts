import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/users.schema';
import { UsersRepository } from '../users.repository';
import { ConfigService } from './config/config.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {}

  private FRONTEND_EXCLUDED_KEYS = ['id', 'hash', 'createdAt'];

  public async getUser(params: { username: string }): Promise<User> {
    return this.usersRepository.findOne(params).exec();
  }

  public async getUserForFrontend(
    params: Partial<User>,
    excludedKeys = this.FRONTEND_EXCLUDED_KEYS,
  ): Promise<User> {
    const user = (await this.usersRepository.findOne(params).exec()).toObject();

    excludedKeys.forEach((k) => {
      delete user[k];
    });

    return user;
  }

  public async getUsers(params: Partial<User>, limit = 100): Promise<User[]> {
    return this.usersRepository.find(params).limit(limit).exec();
  }

  public async getUsersPaginated(
    params: Partial<User>,
    page = 0,
    perPage = 100,
  ): Promise<User[]> {
    const docsCount = await this.usersRepository.count(params);
    let pg = Math.max(0, page) * perPage;
    const lm = Math.max(1, perPage);

    // TODO: check if this is correct, im stoned
    if (pg * lm > docsCount) {
      pg = Math.ceil(docsCount / lm);
    }

    return this.usersRepository.find(params).skip(pg).limit(lm).exec();
  }

  public async getUsersForFrontend(
    params: Partial<User>,
    limit = 100,
    excludedKeys = this.FRONTEND_EXCLUDED_KEYS,
  ): Promise<User[]> {
    const users = await this.usersRepository.find(params).limit(limit).exec();

    users.forEach((u) => {
      excludedKeys.forEach((k) => {
        delete u[k];
      });
    });

    return users;
  }

  public async getUserExist(username: string) {
    return await this.usersRepository.exists({ username });
  }

  public async createUser(user: User & { password: string }): Promise<any> {
    const { password, ...rest } = user;

    if (await this.getUserExist(user.username)) {
      return {
        exists: true,
      };
    }

    const salt = await bcrypt.genSalt(this.configService.getSaltRounds());
    const hash = await bcrypt.hash(password, salt);

    return this.usersRepository.create({
      hash,
      ...rest,
    });
  }

  public async deleteUser(params: Partial<User>): Promise<any> {
    return this.usersRepository.remove(params);
  }
}
