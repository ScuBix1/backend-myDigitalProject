import { Expose } from 'class-transformer';

export class ResponseTutorDto {
  @Expose()
  id?: number;
  @Expose()
  email!: string;
  @Expose()
  password!: string;
  @Expose()
  dob!: Date;
  @Expose()
  lastname!: string;
  @Expose()
  firstname!: string;
  @Expose()
  created_at!: Date;
}
