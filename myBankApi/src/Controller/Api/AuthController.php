<?php

namespace App\Controller\Api;

use App\Entity\User;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;

class AuthController extends AbstractController
{
    // Route pour la connexion, accessible uniquement via POST
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $hasher): JsonResponse
    {
        // Récupère les données JSON envoyées dans la requête (username et password)
        $data = json_decode($request->getContent(), true);
        $username = $data['username'];
        $password = $data['password'];

        // Recherche l'utilisateur en base via le username
        $user = $em->getRepository(User::class)->findOneBy(['username' => $username]);

        // Vérifie que l'utilisateur existe et que le mot de passe est valide
        if (!$user || !$hasher->isPasswordValid($user, $password)) {
            // Si échec, renvoie une réponse JSON avec erreur et code 401 Unauthorized
            return new JsonResponse(['error' => 'Identifiants invalides'], 401);
        }

        // Connexion réussie : renvoie un message JSON et le username
        return new JsonResponse(['message' => 'Connexion réussie', 'username' => $user->getUsername()]);
    }
}
