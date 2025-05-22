import { Request } from 'express';
import { Tutor } from 'src/tutors/entities/tutor.entity';

export interface CustomRequest extends Request {
  tutor: Tutor;
}
