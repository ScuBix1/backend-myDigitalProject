import { Game } from 'src/games/entities/game.entity';
import { Student } from 'src/students/entities/student.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @ManyToOne(() => Student, (student) => student.sessions)
  student: Student;

  @ManyToOne(() => Game, (game) => game.sessions)
  game: Game;
}
