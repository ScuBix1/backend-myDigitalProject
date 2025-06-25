import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSubscriptionsPrices1750870190860
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE subscription 
      SET price = 9.99, stripe_price_id = 'price_1Rdwqq05l0JrObEhtAtV2lGf'
      WHERE type = 'monthly'
    `);

    await queryRunner.query(`
      UPDATE subscription 
      SET price = 99.99, stripe_price_id = 'price_1RdwrO05l0JrObEhbS0LWGle'
      WHERE type = 'annual'
    `);

    await queryRunner.query(`
      DELETE FROM subscription 
      WHERE type = 'weekly'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE subscription 
      SET price = 19.99, stripe_price_id = 'price_1R5pEU05l0JrObEhBIpXNJB7'
      WHERE type = 'monthly'
    `);

    await queryRunner.query(`
      UPDATE subscription 
      SET price = 179.99, stripe_price_id = 'price_1R5pFa05l0JrObEhd857AcOK'
      WHERE type = 'annual'
    `);

    await queryRunner.query(`
      INSERT INTO subscription (type, price, stripe_price_id)
      VALUES ('weekly', 9.99, 'price_1RaLaC05l0JrObEh0AGY57G1')
    `);
  }
}
