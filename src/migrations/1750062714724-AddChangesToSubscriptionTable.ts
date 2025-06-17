import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddChangesToSubscriptionTable1750062714724
  implements MigrationInterface
{
  name = 'AddChangesToSubscriptionTable1750062714724';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`subscription\`
      CHANGE \`type\` \`type\` ENUM('try', 'monthly', 'annual', 'weekly') NOT NULL DEFAULT 'try'
    `);

    await queryRunner.query(`
      ALTER TABLE \`subscription\` DROP COLUMN \`price\`
    `);
    await queryRunner.query(`
      ALTER TABLE \`subscription\`
      ADD \`price\` decimal(10, 2) NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`subscription\`
      CHANGE \`type\` \`type\` ENUM('try', 'monthly', 'annual') NOT NULL DEFAULT 'try'
    `);

    await queryRunner.query(`
      ALTER TABLE \`subscription\` DROP COLUMN \`price\`
    `);
    await queryRunner.query(`
      ALTER TABLE \`subscription\`
      ADD \`price\` int NOT NULL
    `);
  }
}
