import { SalaryData } from './salary-data.interface';

export interface PlayerData
  extends Omit<SalaryData, 'year' | 'contractExpiry' | 'club' | 'league'> {
  name: string;
  nationality: string;
  detailLink?: string;
}
