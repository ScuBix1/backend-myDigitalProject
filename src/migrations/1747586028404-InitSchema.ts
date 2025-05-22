import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1747586028404 implements MigrationInterface {
  name = 'InitSchema1747586028404';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`game\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`score\` int NOT NULL, \`path\` varchar(255) NOT NULL, \`grade\` enum ('PS', 'MS', 'GS') NOT NULL DEFAULT 'PS', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`session\` (\`id\` int NOT NULL AUTO_INCREMENT, \`score\` int NOT NULL, \`student_id\` int NULL, \`game_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`student\` (\`id\` int NOT NULL AUTO_INCREMENT, \`lastname\` varchar(255) NOT NULL, \`firstname\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`start_hour\` timestamp NULL DEFAULT CURRENT_TIMESTAMP, \`duration\` int NULL, \`grade\` enum ('PS', 'MS', 'GS') NOT NULL DEFAULT 'PS', \`tutor_id\` int NULL, UNIQUE INDEX \`IDX_cdf9742519b09580df0bc13cb1\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`subscription\` (\`id\` int NOT NULL AUTO_INCREMENT, \`price\` int NOT NULL, \`stripe_price_id\` varchar(255) NOT NULL, \`type\` enum ('try', 'monthly', 'annual') NOT NULL DEFAULT 'try', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tutor_subscription\` (\`id\` int NOT NULL AUTO_INCREMENT, \`stripe_subscription_id\` varchar(255) NULL, \`is_active\` tinyint NOT NULL DEFAULT 0, \`start_date\` timestamp NULL, \`end_date\` timestamp NULL, \`tutor_id\` int NULL, \`subscription_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`verification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`expires_at\` datetime NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`tutor_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tutor\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`dob\` datetime NOT NULL, \`lastname\` varchar(255) NOT NULL, \`firstname\` varchar(255) NOT NULL, \`customer_id\` varchar(255) NULL, \`account_status\` varchar(255) NOT NULL DEFAULT 'inactif', \`email_verified_at\` datetime NULL, \`has_used_free_session\` tinyint NOT NULL DEFAULT 0, \`admin_id\` int NULL, UNIQUE INDEX \`IDX_840e5143ce8306cc8a4b395624\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`admin\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`manage_tutors\` tinyint NOT NULL, \`manage_subscriptions\` tinyint NOT NULL, \`manage_games\` tinyint NOT NULL, UNIQUE INDEX \`IDX_de87485f6489f5d0995f584195\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`session\` ADD CONSTRAINT \`FK_54818d04c73ba962d80d2b0b0ac\` FOREIGN KEY (\`student_id\`) REFERENCES \`student\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`session\` ADD CONSTRAINT \`FK_7550d8a643f06d78764a84b6fdc\` FOREIGN KEY (\`game_id\`) REFERENCES \`game\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`student\` ADD CONSTRAINT \`FK_2e072ee84a9a02b5ff0cd04c97f\` FOREIGN KEY (\`tutor_id\`) REFERENCES \`tutor\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tutor_subscription\` ADD CONSTRAINT \`FK_b41b0db45b0ab219a1dc287394c\` FOREIGN KEY (\`tutor_id\`) REFERENCES \`tutor\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tutor_subscription\` ADD CONSTRAINT \`FK_a6ca1a84e94dc206cf5f6a30467\` FOREIGN KEY (\`subscription_id\`) REFERENCES \`subscription\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`verification\` ADD CONSTRAINT \`FK_0bf54f1763313bdc84a0b4da0eb\` FOREIGN KEY (\`tutor_id\`) REFERENCES \`tutor\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tutor\` ADD CONSTRAINT \`FK_bc32cd6c4dd44d7c534b6578caa\` FOREIGN KEY (\`admin_id\`) REFERENCES \`admin\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tutor\` DROP FOREIGN KEY \`FK_bc32cd6c4dd44d7c534b6578caa\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`verification\` DROP FOREIGN KEY \`FK_0bf54f1763313bdc84a0b4da0eb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tutor_subscription\` DROP FOREIGN KEY \`FK_a6ca1a84e94dc206cf5f6a30467\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tutor_subscription\` DROP FOREIGN KEY \`FK_b41b0db45b0ab219a1dc287394c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`student\` DROP FOREIGN KEY \`FK_2e072ee84a9a02b5ff0cd04c97f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_7550d8a643f06d78764a84b6fdc\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_54818d04c73ba962d80d2b0b0ac\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_de87485f6489f5d0995f584195\` ON \`admin\``,
    );
    await queryRunner.query(`DROP TABLE \`admin\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_840e5143ce8306cc8a4b395624\` ON \`tutor\``,
    );
    await queryRunner.query(`DROP TABLE \`tutor\``);
    await queryRunner.query(`DROP TABLE \`verification\``);
    await queryRunner.query(`DROP TABLE \`tutor_subscription\``);
    await queryRunner.query(`DROP TABLE \`subscription\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_cdf9742519b09580df0bc13cb1\` ON \`student\``,
    );
    await queryRunner.query(`DROP TABLE \`student\``);
    await queryRunner.query(`DROP TABLE \`session\``);
    await queryRunner.query(`DROP TABLE \`game\``);
  }
}
