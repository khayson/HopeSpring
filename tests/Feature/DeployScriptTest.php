<?php

test('remote deploy script exists and is safe for production updates', function () {
    $path = base_path('scripts/remote-deploy.sh');

    expect(file_exists($path))->toBeTrue();

    $script = file_get_contents($path);

    expect($script)->toContain('migrate --force')
        ->and($script)->toContain('composer install --no-dev')
        ->and($script)->toContain('npm run build')
        ->and($script)->toContain('artisan down')
        ->and($script)->toContain('artisan up')
        ->and($script)->not->toContain('db:seed')
        ->and($script)->not->toContain('app:download-seed-images');
});

test('bootstrap deploy script requires DB_PASS from the environment', function () {
    $script = file_get_contents(base_path('deploy.sh'));

    expect($script)->toContain('DB_PASS:?')
        ->and($script)->not->toMatch('/DB_PASS="hopespringfoundation"/');
});
