import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlayerDocument = HydratedDocument<Player>;

@Schema()
export class Player {
  @Prop()
  name: string;

  @Prop()
  club: string;

  @Prop()
  weeklySalary: string;

  @Prop()
  yearlySalary: string;

  @Prop()
  age: number;

  @Prop()
  position: string;

  @Prop()
  nationality: string;

  @Prop()
  detailLink?: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
