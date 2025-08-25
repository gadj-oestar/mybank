<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use App\Entity\User;
use App\Entity\Operation;
use Doctrine\ORM\EntityManagerInterface;

class ApiControllerTest extends WebTestCase
{
    private $client;
    private $em;

    // Initialisation avant chaque test
    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->em = static::getContainer()->get(EntityManagerInterface::class);

        // Nettoyage des utilisateurs de test
        $this->em->createQuery('DELETE FROM App\Entity\User u WHERE u.username LIKE :username')
            ->setParameter('username', 'testuser%')
            ->execute();

        // Nettoyage des opérations de test
        $this->em->createQuery('DELETE FROM App\Entity\Operation o WHERE o.libelle LIKE :libelle')
            ->setParameter('libelle', 'Test Operation%')
            ->execute();
    }

    // ===================== TEST REGISTER =====================
    public function testRegister(): void
    {
        // Appel de l'API POST /api/register
        $this->client->request('POST', '/api/register', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'username' => 'testuser1',
            'password' => 'password123'
        ]));

        $response = $this->client->getResponse();

        // Vérifie que la réponse est 200 OK
        $this->assertResponseIsSuccessful();

        $data = json_decode($response->getContent(), true);

        // Vérifie que le message et l'id sont corrects
        $this->assertSame('Utilisateur créé avec succès !', $data['message']);
    }

    // ===================== TEST LOGIN =====================
    public function testLogin(): void
    {
        // Crée un utilisateur en base pour le test de login
        $user = new User();
        $user->setUsername('testuser2');
        $user->setPassword(password_hash('mypassword', PASSWORD_BCRYPT)); // Hachage manuel
        $this->em->persist($user);
        $this->em->flush();

        // Appel de l'API POST /api/login
        $this->client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'username' => 'testuser2',
            'password' => 'mypassword'
        ]));

        $response = $this->client->getResponse();
        $this->assertResponseIsSuccessful();

        $data = json_decode($response->getContent(), true);

        // Vérifie que la connexion a réussi et que l'utilisateur est correct
        $this->assertSame('Connexion réussie', $data['message']);
        $this->assertSame('testuser2', $data['username']);
    }

    // ===================== TEST CREATE OPERATION =====================
    public function testCreateOperation(): void
    {
        // Appel de l'API POST /api/operations
        $this->client->request('POST', '/api/operations', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'libelle' => 'Test Operation Create',
            'montant' => 100,
            'categorie' => 'Test',
            'date' => '2025-08-24'
        ]));

        $response = $this->client->getResponse();
        $this->assertResponseIsSuccessful();

        $data = json_decode($response->getContent(), true);

        // Vérifie que l'opération a été créée et que l'id est présent
        $this->assertSame('Opération créée avec succès', $data['message']);
        $this->assertNotEmpty($data['id']);
    }

    // ===================== TEST LIST OPERATIONS =====================
    public function testListOperations(): void
    {
        // Création d'une opération en base pour test
        $op = new Operation();
        $op->setLibelle('Test Operation List');
        $op->setMontant(50);
        $op->setCategorie('Test');
        $op->setDate(new \DateTime('2025-08-24'));
        $this->em->persist($op);
        $this->em->flush();

        // Appel de l'API GET /api/operations
        $this->client->request('GET', '/api/operations');
        $response = $this->client->getResponse();
        $this->assertResponseIsSuccessful();

        $data = json_decode($response->getContent(), true);

        // Vérifie que la réponse contient un tableau d'opérations non vide
        $this->assertIsArray($data);
        $this->assertNotEmpty($data);
    }

    // ===================== TEST DETAIL OPERATION =====================
    public function testDetailOperation(): void
    {
        // Création d'une opération en base pour test
        $op = new Operation();
        $op->setLibelle('Test Operation Detail');
        $op->setMontant(75);
        $op->setCategorie('Test');
        $op->setDate(new \DateTime('2025-08-24'));
        $this->em->persist($op);
        $this->em->flush();

        // Appel de l'API GET /api/operations/{id}
        $this->client->request('GET', '/api/operations/' . $op->getId());
        $response = $this->client->getResponse();
        $this->assertResponseIsSuccessful();

        $data = json_decode($response->getContent(), true);

        // Vérifie que le libellé correspond
        $this->assertSame('Test Operation Detail', $data['libelle']);
    }

    // ===================== TEST UPDATE OPERATION =====================
    public function testUpdateOperation(): void
    {
        // Création d'une opération en base
        $op = new Operation();
        $op->setLibelle('Test Operation Update');
        $op->setMontant(200);
        $op->setCategorie('Test');
        $op->setDate(new \DateTime('2025-08-24'));
        $this->em->persist($op);
        $this->em->flush();

        // Appel de l'API PUT /api/operations/{id} pour mise à jour
        $this->client->request('PUT', '/api/operations/' . $op->getId(), [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'libelle' => 'Updated Operation',
            'montant' => 300
        ]));

        $response = $this->client->getResponse();
        $this->assertResponseIsSuccessful();

        $data = json_decode($response->getContent(), true);

        // Vérifie le message de succès
        $this->assertSame('Opération modifiée avec succès', $data['message']);
    }

    // ===================== TEST DELETE OPERATION =====================
    public function testDeleteOperation(): void
    {
        // Création d'une opération en base
        $op = new Operation();
        $op->setLibelle('Test Operation Delete');
        $op->setMontant(150);
        $op->setCategorie('Test');
        $op->setDate(new \DateTime('2025-08-24'));
        $this->em->persist($op);
        $this->em->flush();

        // Appel de l'API DELETE /api/operations/{id}
        $this->client->request('DELETE', '/api/operations/' . $op->getId());
        $response = $this->client->getResponse();
        $this->assertResponseIsSuccessful();

        $data = json_decode($response->getContent(), true);

        // Vérifie que l'opération a été supprimée
        $this->assertSame('Opération supprimée avec succès', $data['message']);
    }
}
