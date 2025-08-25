<?php

namespace App\Controller\Api;

use App\Entity\User;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Psr\Log\LoggerInterface;

class AuthController extends AbstractController
{
   #[Route('/api/login', name: 'api_login', methods: ['POST'])]
public function login(
    Request $request,
    EntityManagerInterface $em,
    UserPasswordHasherInterface $hasher,
    JWTTokenManagerInterface $jwtManager,
    LoggerInterface $logger
): JsonResponse {
    $data = json_decode($request->getContent(), true);
    $username = $data['username'] ?? null;
    $password = $data['password'] ?? null;

    if (!$username || !$password) {
        return new JsonResponse(['error' => 'Username et password requis'], 400);
    }

    $user = $em->getRepository(User::class)->findOneBy(['username' => $username]);

    if (!$user || !$hasher->isPasswordValid($user, $password)) {
        return new JsonResponse(['error' => 'Identifiants invalides'], 401);
    }

    // Génération du JWT
    $token = $jwtManager->create($user);
    $logger->info('JWT généré : ' . $token);

    // Retourner le token directement dans le JSON
    return new JsonResponse([
        'message' => 'Connexion réussie',
        'username' => $user->getUsername(),
        'token' => $token // <-- React pourra le récupérer ici
    ]);
}
};