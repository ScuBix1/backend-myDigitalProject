import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Admin } from './src/admins/entities/admin.entity';
import { Game } from './src/games/entities/game.entity';
import { Session } from './src/sessions/entities/session.entity';
import { Student } from './src/students/entities/student.entity';
import { Subscription } from './src/subscriptions/entities/subscription.entity';
import { TutorSubscription } from './src/subscriptions/entities/tutorSubscription.entity';
import { Tutor } from './src/tutors/entities/tutor.entity';
import { Verification } from './src/verification/entities/verification.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? +process.env.DB_PORT : 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    Admin,
    Tutor,
    Student,
    Game,
    Session,
    Subscription,
    TutorSubscription,
    Verification,
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
