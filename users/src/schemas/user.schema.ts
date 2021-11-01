import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRoles } from '../enums/user-roles';

export type UserDocument = User & Document;

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
  delete ret.id;
}

@Schema({
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: transformValue,
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    transform: transformValue,
  },
})
export class User {
  @Prop({
    lowercase: true,
    required: [true, 'Username cannot be empty'],
    unique: true,
    index: true,
    maxlength: 40,
    minlength: 2,
    trim: true,
  })
  readonly username: string;

  @Prop({
    required: [true, 'Hash cannot be empty'],
  })
  hash: string;

  @Prop({
    type: String,
    required: [true, 'User role is required'],
    default: UserRoles.USER
  })
  role: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop(String)
  bio: string;

  @Prop(String)
  avatar: string;

  @Prop(String)
  nickname: string;

  @Prop(String)
  fullName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
