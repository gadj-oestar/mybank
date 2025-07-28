<?php

namespace App\Controller;

use App\Entity\Operation;
use App\Repository\OperationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

final class OperationController extends AbstractController
{
    // Création d'une opération via POST /api/operations
    #[Route('/api/operations', name: 'api_operations_create', methods: ['POST'])]
    public function createOperation(Request $request, EntityManagerInterface $em): Response
    {
        // Décodage des données JSON envoyées par le client
        $data = json_decode($request->getContent(), true);

        // Création d'une nouvelle instance d'Operation et hydratation des champs
        $operation = new Operation();
        $operation->setLibelle($data['libelle'] ?? ''); // libellé ou chaîne vide par défaut
        $operation->setMontant($data['montant'] ?? 0);  // montant ou 0 par défaut
        $operation->setDate(new \DateTime($data['date'] ?? 'now')); // date ou aujourd'hui par défaut
        $operation->setCategorie($data['categorie'] ?? ''); // catégorie ou vide

        // Persistance de l'entité en base
        $em->persist($operation);
        $em->flush();

        // Réponse JSON avec message et id créé
        return $this->json([
            'message' => 'Opération créée avec succès',
            'id' => $operation->getId()
        ]);
    }

    // Récupération de la liste de toutes les opérations via GET /api/operations
    #[Route('/api/operations', name: 'api_operations_list', methods: ['GET'])]
    public function listOperations(OperationRepository $repo): Response
    {
        // Récupération de toutes les opérations
        $operations = $repo->findAll();

        // Transformation des entités en tableau associatif prêt à être converti en JSON
        $data = array_map(function ($op) {
            return [
                'id' => $op->getId(),
                'libelle' => $op->getLibelle(),
                'montant' => $op->getMontant(),
                'categorie' => $op->getCategorie(),
                'date' => $op->getDate()->format('Y-m-d'), // format date ISO
            ];
        }, $operations);

        // Réponse JSON avec la liste des opérations
        return $this->json($data);
    }

    // Détail d'une opération spécifique via GET /api/operations/{id}
    #[Route('/api/operations/{id}', name: 'api_operation_detail', methods: ['GET'])]
    public function detailOperation(Operation $operation): Response
    {
        // Symfony injecte automatiquement l'entité Operation via paramConverter selon l'id dans l'URL
        return $this->json([
            'id' => $operation->getId(),
            'libelle' => $operation->getLibelle(),
            'montant' => $operation->getMontant(),
            'categorie' => $operation->getCategorie(),
            'date' => $operation->getDate()->format('Y-m-d'),
        ]);
    }

    // Mise à jour d'une opération via PUT /api/operations/{id}
    #[Route('/api/operations/{id}', name: 'api_operation_update', methods: ['PUT'])]
    public function updateOperation(Operation $operation, Request $request, EntityManagerInterface $em): Response
    {
        // Décodage des données JSON envoyées
        $data = json_decode($request->getContent(), true);

        // Mise à jour des champs s'ils sont fournis, sinon on garde les valeurs existantes
        $operation->setLibelle($data['libelle'] ?? $operation->getLibelle());
        $operation->setMontant($data['montant'] ?? $operation->getMontant());
        $operation->setCategorie($data['categorie'] ?? $operation->getCategorie());

        // Mise à jour de la date uniquement si présente dans les données
        if (!empty($data['date'])) {
            $operation->setDate(new \DateTime($data['date']));
        }

        // Enregistrement en base
        $em->flush();

        return $this->json(['message' => 'Opération modifiée avec succès']);
    }

    // Suppression d'une opération via DELETE /api/operations/{id}
    #[Route('/api/operations/{id}', name: 'api_operation_delete', methods: ['DELETE'])]
    public function deleteOperation(Operation $operation, EntityManagerInterface $em): Response
    {
        // Suppression de l'entité
        $em->remove($operation);
        $em->flush();

        return $this->json(['message' => 'Opération supprimée avec succès']);
    }
}
