import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema } from 'mongoose';

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
  @Prop({ required: [true, 'Token must be associated with username'] })
  readonly username: string;

  @Prop({
    required: [true, 'device cannot be empty'],
    default: MSchema.Types.ObjectId,
    type: MSchema.Types.ObjectId,
    ref: 'devices',
  })
  readonly device: MSchema.Types.ObjectId;

  @Prop({ type: Number, default: Date.now() })
  timestamp: number;

  @Prop({ required: [true, 'Cannot save session without refreshToken'] })
  refreshToken: string;

  @Prop()
  revoked?: boolean;

  @Prop()
  revoke_timestamp?: number;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
