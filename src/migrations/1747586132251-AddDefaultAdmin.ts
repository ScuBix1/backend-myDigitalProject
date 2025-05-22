import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { MigrationInterface, QueryRunner } from 'typeorm';

dotenv.config();

export class AddDefaultAdmin1747586132251 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const email = process.env.DEFAULT_ADMIN_EMAIL;
    const password = process.env.DEFAULT_ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error(
        'Une erreur est survenue lors de la création de l’administrateur par défaut.',
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await queryRunner.query(
      `
      INSERT INTO \`admin\` (email, password, manage_tutors, manage_subscriptions, manage_games)
      VALUES (?, ?, true, true, true)
    `,
      [email, hashedPassword],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const email = process.env.DEFAULT_ADMIN_EMAIL;

    if (!email) {
      throw new Error(
        'Une erreur est survenue lors de la suppression de l’administrateur par défaut.',
      );
    }

    await queryRunner.query(`DELETE FROM \`admin\` WHERE email = ?`, [email]);
  }
}
