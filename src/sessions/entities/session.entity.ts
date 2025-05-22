import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from '../../games/entities/game.entity';
import { Student } from '../../students/entities/student.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  score!: number;

  @ManyToOne(() => Student, (student) => student.sessions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student!: Student;

  @ManyToOne(() => Game, (game) => game.sessions)
  @JoinColumn({ name: 'game_id' })
  game!: Game;
}
