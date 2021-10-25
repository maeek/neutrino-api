// import * as mongoose from 'mongoose';

// function transformValue(doc, ret: { [key: string]: any }) {
//   delete ret._id;
// }

// export const TokenSchema = new mongoose.Schema(
//   {
//     user_id: {
//       type: String,
//       required: [true, 'user_id can not be empty'],
//     },
//     refresh_token: {
//       type: String,
//       required: [true, 'refresh_token token can not be empty'],
//     },
//     device_id: {
//       type: String,
//       required: [
//         true,
//         'New session must be associated with specific device_id',
//       ],
//     },
//     blocked: Boolean,
//     timestamp: Number,
//   },
//   {
//     toObject: {
//       virtuals: true,
//       versionKey: false,
//       transform: transformValue,
//     },
//     toJSON: {
//       virtuals: true,
//       versionKey: false,
//       transform: transformValue,
//     },
//   },
// );

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type TokenDocument = Token & Document;

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
  delete ret.id;
}

@Schema({
  collection: 'tokens',
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
export class Token {
  @Prop({ required: [true, 'Token must be associated with user_id'] })
  user_id: string;

  @Prop({
    required: [true, 'device_id cannot be empty'],
    unique: true,
    default: uuidv4,
  })
  readonly device_id: string;

  @Prop({ type: Number, default: Date.now() })
  timestamp: number;

  @Prop({ required: true })
  refresh_token: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
