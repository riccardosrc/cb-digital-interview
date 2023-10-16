import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Salary {
  @Prop()
  year: number;

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
  contractExpiry: string;
}

export const SalarySchema = SchemaFactory.createForClass(Salary);
