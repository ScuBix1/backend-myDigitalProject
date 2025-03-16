import { Game } from 'src/games/entities/game.entity';
import { Student } from 'src/students/entities/student.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @ManyToOne(() => Student, (student) => student.sessions)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Game, (game) => game.sessions)
  @JoinColumn({ name: 'game_id' })
  game: Game;
}
