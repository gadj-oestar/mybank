<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250825105242 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE operation DROP FOREIGN KEY FK_1981A66DA76ED395
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_1981A66DA76ED395 ON operation
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE operation DROP user_id
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE operation ADD user_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE operation ADD CONSTRAINT FK_1981A66DA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_1981A66DA76ED395 ON operation (user_id)
        SQL);
    }
}
