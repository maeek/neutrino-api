import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema } from 'mongoose';
import { ConfigService } from '../services/config/config.service';
import { UserType } from '../constants';

export type UserDocument = User & Document;

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
  // delete ret.id;
}

@Schema({
  collection: 'users',
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
    required: [true, 'username cannot be empty'],
    unique: true,
    index: true,
    maxlength: 50,
    minlength: 3,
    lowercase: true,
    trim: true,
    validate: {
      validator: (val: string) => {
        const configService = new ConfigService();
        return !configService
          .getRestrictedUsernames()
          .includes(val.toLowerCase());
      },
      message: 'This username is restricted',
    },
  })
  readonly username: string;

  @Prop({
    type: String,
    required: [true, 'User type is required'],
    default: UserType.USER,
  })
  type: string;

  @Prop({
    required: [true, 'Hash cannot be empty'],
  })
  hash: string;

  @Prop({ type: Number, default: Date.now() })
  createdAt: number;

  @Prop({
    maxlength: 50,
    trim: true,
  })
  fullName: string;

  @Prop({
    maxlength: 50,
    trim: true,
  })
  nickname: string;

  @Prop({ trim: true })
  avatar: string;

  @Prop({
    trim: true,
    maxlength: 255,
  })
  bio: string;

  @Prop({
    type: MSchema.Types.ObjectId,
    ref: 'settings',
  })
  settingsId: MSchema.Types.ObjectId;

  // below TBD values
  @Prop({
    type: MSchema.Types.ObjectId,
    ref: 'settings',
  })
  recoverCodesId: MSchema.Types.ObjectId;

  @Prop()
  disabled: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
