import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { ResponseGameDto } from './dto/response-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
  ) {}

  async create(createGameDto: CreateGameDto) {
    const game = this.gamesRepository.create(createGameDto);
    const savedGame = await this.gamesRepository.save(game);

    return plainToInstance(ResponseGameDto, savedGame);
  }

  findAll() {
    return `This action returns all games`;
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
