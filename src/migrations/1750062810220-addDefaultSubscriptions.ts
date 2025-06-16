import { SubscriptionType } from 'src/constants/enums/subscriptions.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultSubscriptions1750062810220
  implements MigrationInterface
{
  name = 'AddDefaultSubscriptions1750062810220';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO subscription (price, stripe_price_id, type)
      VALUES
        (9.99, 'price_1RaLaC05l0JrObEh0AGY57G1', '${SubscriptionType.WEEKLY}'),
        (19.99, 'price_1R5pEU05l0JrObEhBIpXNJB7', '${SubscriptionType.MONTHLY}'),
        (179.99, 'price_1R5pFa05l0JrObEhd857AcOK', '${SubscriptionType.ANNUAL}');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM subscription
      WHERE stripe_price_id IN (
        'price_1RaLaC05l0JrObEh0AGY57G1',
        'price_1R5pEU05l0JrObEhBIpXNJB7',
        'price_1R5pFa05l0JrObEhd857AcOK'
      );
    `);
  }
}
