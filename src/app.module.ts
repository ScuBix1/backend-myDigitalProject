import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { AdminsModule } from './admins/admins.module';
import { Admin } from './admins/entities/admin.entity';
import { AuthModule } from './auth/auth.module';
import { Game } from './games/entities/game.entity';
import { GamesModule } from './games/games.module';
import { Session } from './sessions/entities/session.entity';
import { SessionsModule } from './sessions/sessions.module';
import { StripeModule } from './stripe/stripe.module';
import { Student } from './students/entities/student.entity';
import { StudentsModule } from './students/students.module';
import { StudentsService } from './students/students.service';
import { Subscription } from './subscriptions/entities/subscription.entity';
import { TutorSubscription } from './subscriptions/entities/tutorSubscription.entity';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { Tutor } from './tutors/entities/tutor.entity';
import { TutorsModule } from './tutors/tutors.module';
import { Verification } from './verification/entities/verification.entity';
import { VerificationModule } from './verification/verification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get('FALLBACK_LANG') ?? 'fr',
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
      useFactory: (configService: ConfigService) => {
        console.log('DB_HOST:', configService.get('DB_HOST'));
        console.log('DB_PORT:', configService.get('DB_PORT'));
        console.log('DB_USERNAME:', configService.get('DB_USERNAME'));
        console.log('DB_PASSWORD:', configService.get('DB_PASSWORD'));
        console.log('DB_NAME:', configService.get('DB_NAME'));
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: +configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [
            Admin,
            Tutor,
            Student,
            Game,
            Session,
            Subscription,
            Verification,
            TutorSubscription,
          ],
          synchronize: false,
          migrations: ['src/migrations/*.ts'],
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    TutorsModule,
    StudentsModule,
    AdminsModule,
    SubscriptionsModule,
    SessionsModule,
    GamesModule,
    VerificationModule,
    StripeModule,
  ],
  providers: [StudentsService],
})
export class AppModule {}
