import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStudentAvatar1748110973023 implements MigrationInterface {
  name = 'AddStudentAvatar1748110973023';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`student\`
            ADD \`avatar\` varchar(255) NOT NULL DEFAULT 'wizard.png'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`student\` DROP COLUMN \`avatar\`
        `);
  }
}
