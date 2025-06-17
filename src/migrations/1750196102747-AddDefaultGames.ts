import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultGames1750196102747 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO game (name, score, path, grade)
      VALUES
        ('Additionner les animaux', 100, 'additionner-les-animaux', 'PS'),
        ('Trouver la couleur différente', 100, 'trouver-la-couleur-differente', 'PS'),
        ('Compter les animaux', 100, 'compter-les-animaux', 'PS'),
        ('Trier les animaux', 100, 'trier-les-animaux', 'PS');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM game
      WHERE name IN (
        'Additionner les animaux',
        'Trouver la couleur différente',
        'Compter les animaux',
        'Trier les animaux'
      );
    `);
  }
}
