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
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $hasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $username = $data['username'];
        $password = $data['password'];

        $user = $em->getRepository(User::class)->findOneBy(['username' => $username]);

        if (!$user || !$hasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['error' => 'Identifiants invalides'], 401);
        }

        // Connexion réussie - retour avec des informations JSON
        return new JsonResponse(['message' => 'Connexion réussie', 'username' => $user->getUsername()]);
    }
}
