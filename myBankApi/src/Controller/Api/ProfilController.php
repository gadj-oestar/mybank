<?php

namespace App\Controller\Api;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ProfilController extends AbstractController
{
    #[Route('/api/profil', name: 'api_profil_get', methods: ['GET'])]
    public function getProfil(EntityManagerInterface $em): JsonResponse
    {
        // On prend juste le premier utilisateur (ID = 1) pour test
        $user = $em->getRepository(User::class)->find(1);

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur introuvable'], 404);
        }

        return new JsonResponse([
            'username' => $user->getUsername(),
            'password' => $user->getPassword(), // pour test uniquement
        ]);
    }

    #[Route('/api/profil', name: 'api_profil_update', methods: ['PUT'])]
    public function updateProfil(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $user = $em->getRepository(User::class)->find(1);
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur introuvable'], 404);
        }

        if (isset($data['username'])) {
            $user->setUsername($data['username']);
        }

        if (!empty($data['password'])) {
            $user->setPassword($data['password']); // pas haché pour test
        }

        $em->flush();

        return new JsonResponse(['message' => 'Profil mis à jour']);
    }
}
