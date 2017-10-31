+++
date = "2016-05-02T20:40:00+02:00"
title = "Programmatically Login User With symfony/security in Silex"
tags = ["PHP", "Silex", "Symfony"]
+++

Last night I was experimenting with Silex and I needed a register/login form. Silex comes with a `SecurityServiceProvider` which gives you the power of the symfony/security component. But I couldn't figure out how to programmatically login the user after registration. So here's my solution:

The registration controller:
```php
<?php

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;

final class RegistrationController
{
    // ...

    public function register(Request $request, Application $app)
    {
        $email = $request->get('email');
        $password = $request->get('password');

        // validation logic.
        // ...

        // Persist the user in your database.
        $this->registrationService->register($email, $password);

        $credentials = [
            '_csrf_token' => 'generate-a-csrf-token',
            '_username' => $email,
            '_password' => $password,
        ];

        // Create a uri to the login authentication route.
        $uri = $request->getUriForPath('/login/check');

        // Create a sub request which pretends to be a user login request.
        $loginRequest = Request::create(
            $uri,
            'POST',
            $credentials,
            $request->cookies->all(),
            $request->files->all(),
            $request->server->all()
        );

        // Let our application handle the login request.
        return $app->handle($loginRequest);
    }
}
```

The configuration for the security provider:
```php
<?php

$app->register(new SecurityServiceProvider(), array(
    'security.firewalls' => [
        'login' => [
            'pattern' => '^/login$',
        ],
        'register' => [
            'pattern' => '^/register$',
        ],
        'app' => [
            'pattern' => '^/',
            'form' => [
                'login_path' => '/login',
                'check_path' => '/login/check',
            ],
            'logout' => [
                'logout_path' => '/logout',
                'invalidate_session' => true,
            ],
            'users' => $app->share(function () use ($app) {
                return new UserProvider($app['UserRepository']);
            }),
        ],
    ],
));
```

That's it! Happy coding!
