import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, Query } from "mongoose";

import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    findOne(userFilterQuery: FilterQuery<UserDocument>): Query<User, UserDocument> {
        return this.userModel.findOne(userFilterQuery);
    }

    find(usersFilterQuery: FilterQuery<UserDocument>): Query<User[], UserDocument> {
        return this.userModel.find(usersFilterQuery)
    }

    async create(user: Partial<User> & { name: string; meta: string }): Promise<User> {
        const newUser = new this.userModel(user);
        return newUser.save()
    }

    async remove(userFilterQuery: FilterQuery<UserDocument>): Promise<User> {
      return this.userModel.remove(userFilterQuery);
    }

    async findOneAndUpdate(userFilterQuery: FilterQuery<UserDocument>, user: Partial<User>): Promise<User> {
        return this.userModel.findOneAndUpdate(userFilterQuery, user, { new: true });
    }
}