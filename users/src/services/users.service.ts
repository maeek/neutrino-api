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

  private EXCLUDED_KEYS = ['_id'];

  public async getUser(params: { username: string }): Promise<User> {
    return this.usersRepository.findOne(params).exec();
  }

  public async getUserForFrontend(
    params: Partial<User>,
    excludedKeys = this.EXCLUDED_KEYS,
  ): Promise<User> {
    const user = await this.usersRepository.findOne(params).exec();

    excludedKeys.forEach((k) => {
      delete user[k];
    });

    return user;
  }

  public async getUsers(params: Partial<User>, limit = 100): Promise<User[]> {
    return this.usersRepository.find(params).limit(limit).exec();
  }

  public async getUsersForFrontend(
    params: Partial<User>,
    limit = 100,
    excludedKeys = this.EXCLUDED_KEYS,
  ): Promise<User[]> {
    const users = await this.usersRepository.find(params).limit(limit).exec();

    users.forEach((u) => {
      excludedKeys.forEach((k) => {
        delete u[k];
      });
    });

    return users;
  }

  // public async updateUserById(
  //   id: string,
  //   userParams: { is_confirmed: boolean },
  // ): Promise<IUser> {
  //   return this.usersRepository.updateOne({ _id: id }, userParams).exec();
  // }

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

  // public async createUserLink(id: string): Promise<IUserLink> {
  //   const userLinkModel = new this.userLinkModel({
  //     user_id: id,
  //   });
  //   return await userLinkModel.save();
  // }

  // public async getUserLink(link: string): Promise<IUserLink[]> {
  //   return this.userLinkModel.find({ link, is_used: false }).exec();
  // }

  // public async updateUserLinkById(
  //   id: string,
  //   linkParams: { is_used: boolean },
  // ): Promise<IUserLink> {
  //   return this.userLinkModel.updateOne({ _id: id }, linkParams);
  // }

  // public getConfirmationLink(link: string): string {
  //   return `${this.configService.get('baseUri')}:${this.configService.get(
  //     'gatewayPort',
  //   )}/users/confirm/${link}`;
  // }
}
