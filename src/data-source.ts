import 'dotenv/config';
import { DataSource } from 'typeorm';

import { Admin } from './admins/entities/admin.entity';
import { Game } from './games/entities/game.entity';
import { Session } from './sessions/entities/session.entity';
import { Student } from './students/entities/student.entity';
import { Subscription } from './subscriptions/entities/subscription.entity';
import { TutorSubscription } from './subscriptions/entities/tutorSubscription.entity';
import { Tutor } from './tutors/entities/tutor.entity';
import { Verification } from './verification/entities/verification.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT ?? 3306),
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
  migrations: [
    process.env.NODE_ENV === 'production'
      ? 'dist/migrations/*.js'
      : 'src/migrations/*.ts',
  ],
  synchronize: false,
});
