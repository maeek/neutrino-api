import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Token, TokenDocument } from './schemas/token.schema';

@Injectable()
export class TokenRepository {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  findOne(tokenFilterQuery: FilterQuery<TokenDocument>) {
    return this.tokenModel.findOne(tokenFilterQuery);
  }

  find(tokensFilterQuery: FilterQuery<TokenDocument>) {
    return this.tokenModel.find(tokensFilterQuery);
  }

  async create(
    token: Partial<Token> & { username: string; refreshToken: string },
  ) {
    const newToken = new this.tokenModel(token);
    return newToken.save();
  }

  async remove(tokenFilterQuery: FilterQuery<TokenDocument>) {
    return this.tokenModel.deleteMany(tokenFilterQuery);
  }

  async findOneAndUpdate(
    tokenFilterQuery: FilterQuery<TokenDocument>,
    token: Partial<Token>,
  ) {
    return this.tokenModel.findOneAndUpdate(tokenFilterQuery, token, {
      new: true,
    });
  }
}
