import { IsIn, IsString } from 'class-validator';

export class UpdateStudentAvatarDto {
  @IsString()
  @IsIn([
    'cat.png',
    'cloud.png',
    'ladybug.png',
    'zebra.png',
    'robot.png',
    'wizard.png',
  ])
  avatar!: string;
}
