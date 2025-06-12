import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('tutor')
  @Post()
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('student/:studentId')
  findAllByStudent(@Param('studentId') studentId: string) {
    return this.sessionsService.findAllByStudent(+studentId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('tutor')
  @Patch(':gameId/:studentId/high-score/:newScore')
  updateHighScore(
    @Param('gameId') gameId: string,
    @Param('studentId') studentId: string,
    @Param('newScore') newScore: string,
  ) {
    return this.sessionsService.updateHighScore(+gameId, +studentId, +newScore);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('tutor')
  @Get('student/:studentId/game/:gameId')
  findByStudentAndGame(
    @Param('studentId') studentId: string,
    @Param('gameId') gameId: string,
  ) {
    return this.sessionsService.findByStudentAndGame(+studentId, +gameId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('tutor')
  @Get('/students/:studentId/games/:gameId/active-session-check')
  async checkSessionExists(
    @Param('studentId') studentId: number,
    @Param('gameId') gameId: number,
  ) {
    const sessionExists = await this.sessionsService.hasActiveSession(
      studentId,
      gameId,
    );
    return { session_existing: sessionExists };
  }
}
