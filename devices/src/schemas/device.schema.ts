import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type DeviceDocument = Device & Document;

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
  delete ret.id;
}

@Schema({
  collection: 'devices',
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
export class Device {
  @Prop({ required: [true, 'Device name cannot be empty'] })
  name: string;

  @Prop({
    required: [true, 'device_id cannot be empty'],
    unique: true,
    default: uuidv4,
  })
  readonly device_id: string;

  @Prop({ type: Number, default: Date.now() })
  timestamp: number;

  @Prop({ required: true })
  meta: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
