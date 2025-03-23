import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { AdminsModule } from './admins/admins.module';
import { Admin } from './admins/entities/admin.entity';
import { AuthModule } from './auth/auth.module';
import { Game } from './games/entities/game.entity';
import { GamesModule } from './games/games.module';
import { Grade } from './grades/entities/grade.entity';
import { GradesModule } from './grades/grades.module';
import { Session } from './sessions/entities/session.entity';
import { SessionsModule } from './sessions/sessions.module';
import { Student } from './students/entities/student.entity';
import { StudentsModule } from './students/students.module';
import { StudentsService } from './students/students.service';
import { Subscription } from './subscriptions/entities/subscription.entity';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { Tutor } from './tutors/entities/tutor.entity';
import { TutorsModule } from './tutors/tutors.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get('FALLBACK_LANG'),
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        { use: AcceptLanguageResolver, options: ['lang', 'l', 'locale'] },
      ],
      inject: [ConfigService],
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
