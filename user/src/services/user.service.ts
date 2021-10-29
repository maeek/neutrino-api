import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { UserRepository } from '../user.repository';

import { ConfigService } from './config/config.service';
// import { IUser } from '../interfaces/user.interface';
// import { IUserLink } from '../interfaces/user-link.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    // @InjectModel('UserLink') private readonly userLinkModel: Model<IUserLink>,
    // private readonly configService: ConfigService,
  ) {}

  private EXCLUDED_KEYS = ['_id'];

  public async getUser(params: { username: string }): Promise<User> {
    return this.userRepository.findOne(params).exec();
  }

  public async getUserForFrontend(
    params: Partial<User>,
    excludedKeys = this.EXCLUDED_KEYS
  ): Promise<User> {
    const user = await this.userRepository.findOne(params).exec();

    excludedKeys.forEach(k => {
      delete user[k];
    });

    return user;
  }

  public async getUsers(
    params: Partial<User>,
    limit = 100
  ): Promise<User[]> {
    return this.userRepository.find(params)
      .limit(limit)
      .exec();
  }

  public async getUsersForFrontend(
    params: Partial<User>,
    limit = 100,
    excludedKeys = this.EXCLUDED_KEYS
  ): Promise<User[]> {
    const users = await this.userRepository.find(params)
      .limit(limit)
      .exec();

    users.forEach(u => {
      excludedKeys.forEach(k => {
        delete u[k];
      });
    });

    return users;
  }

  // public async updateUserById(
  //   id: string,
  //   userParams: { is_confirmed: boolean },
  // ): Promise<IUser> {
  //   return this.userRepository.updateOne({ _id: id }, userParams).exec();
  // }

  // public async createUser(user: IUser): Promise<IUser> {
  //   const userRepository = new this.userModel(user);
  //   return await userModel.save();
  // }

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
