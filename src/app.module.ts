import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TutorsModule } from './tutors/tutors.module';
import { Tutor } from './tutors/entities/tutor.entity';
import { StudentsService } from './students/students.service';
import { StudentsModule } from './students/students.module';
import { Student } from './students/entities/student.entity';
import { AdminsModule } from './admins/admins.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { SessionsModule } from './sessions/sessions.module';
import { GamesModule } from './games/games.module';
import { Admin } from './admins/entities/admin.entity';
import { Game } from './games/entities/game.entity';
import { Session } from './sessions/entities/session.entity';
import { GradesModule } from './grades/grades.module';
import { Grade } from './grades/entities/grade.entity';
import { Subscription } from './subscriptions/entities/subscription.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Admin, Tutor, Student, Game, Session, Grade, Subscription],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    TutorsModule,
    StudentsModule,
    AdminsModule,
    SubscriptionsModule,
    SessionsModule,
    GamesModule,
    GradesModule,
  ],
  providers: [StudentsService],
})
export class AppModule {}
