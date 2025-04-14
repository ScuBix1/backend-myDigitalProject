import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IsTutorOfStudentGuard implements CanActivate {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const studentId = parseInt(request.params.id);

    if (!user || user.role !== 'tutor') return false;
    if (!studentId || isNaN(studentId)) return false;

    const student = await this.studentsRepository.findOne({
      where: { id: studentId },
    });
    if (!student || !student.tutor || student.tutor.id !== user.id) {
      throw new NotFoundException("Vous n'avez pas accès à cet élève");
    }

    return true;
  }
}
