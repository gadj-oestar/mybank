<?php

namespace App\Controller\Api;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class ProfilController extends AbstractController
{
    // Route pour récupérer les informations du profil utilisateur connecté via GET /api/profil
    #[Route('/api/profil', name: 'api_profil_get', methods: ['GET'])]
    public function getProfil(): JsonResponse
    {
        // Récupère l'utilisateur actuellement connecté (via le système de sécurité Symfony)
        $user = $this->getUser();

        // Si aucun utilisateur connecté, on renvoie une erreur 401 Unauthorized
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Utilisateur non connecté'], 401);
        }

        // On retourne les informations utiles (ici seulement le nom d'utilisateur)
        return new JsonResponse([
            'username' => $user->getUsername(),
        ]);
    }

    // Route pour mettre à jour le profil utilisateur connecté via PUT /api/profil
    #[Route('/api/profil', name: 'api_profil_update', methods: ['PUT'])]
    public function updateProfil(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $hasher
    ): JsonResponse {
        // Récupère l'utilisateur connecté
        $user = $this->getUser();

        // Si aucun utilisateur connecté, on renvoie une erreur 401 Unauthorized
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Utilisateur non connecté'], 401);
        }

        // Récupère les données JSON envoyées dans la requête PUT
        $data = json_decode($request->getContent(), true);

        // Si le champ "username" est présent dans les données, on met à jour le nom d'utilisateur
        if (isset($data['username'])) {
            $user->setUsername($data['username']);
        }

        // Si un nouveau mot de passe est fourni, on le hash et on met à jour le mot de passe utilisateur
        if (!empty($data['password'])) {
            $hashedPassword = $hasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);
        }

        // On sauvegarde les changements dans la base de données
        $em->flush();

        // On renvoie un message de succès
        return new JsonResponse(['message' => 'Profil mis à jour']);
    }
}
