<?php

namespace App\Controller;

use App\Entity\Operation;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\OperationRepository;

final class OperationController extends AbstractController
{
    #[Route('/api/operations', name: 'api_operations_create', methods: ['POST'])]
    public function createOperation(Request $request, EntityManagerInterface $em): Response
    {
        $data = json_decode($request->getContent(), true);

        $operation = new Operation();
        $operation->setLibelle($data['libelle'] ?? '');
        $operation->setMontant($data['montant'] ?? 0);
        $operation->setCategorie($data['categorie'] ?? '');
        $operation->setDate(new \DateTime($data['date'] ?? 'now'));

        $em->persist($operation);
        $em->flush();

        return $this->json([
            'message' => 'Opération créée avec succès',
            'id' => $operation->getId()
        ]);
    }
    
    #[Route('/api/operations', name: 'api_operations_list', methods: ['GET'])]
public function listOperations(OperationRepository $repo): JsonResponse
{
    $operations = $repo->findAll();

    $data = array_map(function ($op) {
        return [
            'id' => $op->getId(),
            'libelle' => $op->getLibelle(),
            'montant' => $op->getMontant(),
            'categorie' => $op->getCategorie(),
            'date' => $op->getDate()->format('Y-m-d'),
        ];
    }, $operations);

    return $this->json($data);
}
}

