import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Salary, SalarySchema } from './salary.entity';

export type PlayerDocument = HydratedDocument<Player>;

@Schema()
export class Player {
  @Prop()
  name: string;

  @Prop()
  league: string;

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

  @Prop({ type: [SalarySchema] })
  salaryHistory: Salary[];
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
