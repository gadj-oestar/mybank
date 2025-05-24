<?php

namespace App\Controller\Api;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class RegisterController extends AbstractController
{
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['username']) || empty($data['password'])) {
            return new JsonResponse(['message' => 'Nom d’utilisateur et mot de passe requis.'], 400);
        }

        $existingUser = $em->getRepository(User::class)->findOneBy(['username' => $data['username']]);
        if ($existingUser) {
            return new JsonResponse(['message' => 'Nom d’utilisateur déjà utilisé.'], 400);
        }

        $user = new User();
        $user->setUsername($data['username']);
        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        $em->persist($user);
        $em->flush();

        return new JsonResponse(['message' => 'Utilisateur créé avec succès !'], 201);
    }
}
