<?php


namespace App\Controller\Api;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class CategorieController extends AbstractController
{
    // Cette route répondra à GET /api/categories
    #[Route('/api/categories', name: 'api_used_categories', methods: ['GET'])]
    public function getUsedCategories(EntityManagerInterface $em): JsonResponse
    {
        // On récupère la connexion SQL brute via l'EntityManager
        $conn = $em->getConnection();

        // Requête SQL pour récupérer toutes les catégories distinctes dans la table operation
        $sql = 'SELECT DISTINCT categorie FROM operation WHERE categorie IS NOT NULL';

        // On prépare la requête
        $stmt = $conn->prepare($sql);

        // On l'exécute
        $resultSet = $stmt->executeQuery();

        // On récupère un tableau de tableaux associatifs comme : [['categorie' => 'courses'], ...]
        $categories = $resultSet->fetchAllAssociative();

        // On transforme ça en un tableau simple de strings : ['courses', 'loyer', 'salaire']
        $categorieList = array_map(fn($row) => $row['categorie'], $categories);

        // On renvoie la liste au format JSON
        return $this->json($categorieList);
    }
}
