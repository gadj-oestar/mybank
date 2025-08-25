<?php

namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class LoginSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    private $jwtManager;

    public function __construct(JWTTokenManagerInterface $jwtManager)
    {
        $this->jwtManager = $jwtManager;
    }

    public function onAuthenticationSuccess($request, TokenInterface $token): Response
    {
        /** @var UserInterface $user */
        $user = $token->getUser();
        $jwt = $this->jwtManager->create($user);

        // Crée le cookie avec le JWT
        $cookie = Cookie::create('BEARER', $jwt)
                        ->withHttpOnly(true)
                        ->withSecure(false) // true en prod
                        ->withPath('/')
                        ->withSameSite('lax');

        $response = new JsonResponse(['message' => 'Connexion réussie'], Response::HTTP_OK);
        $response->headers->setCookie($cookie);
        return $response;
    }
}
