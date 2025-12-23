<?php
// Load Laravel environment
require __DIR__.'/backend/vendor/autoload.php';

// Create database if not exists
try {
    $pdo = new PDO(
        'mysql:host=127.0.0.1;port=3306',
        'root',
        '88888888'
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `video_hosting` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    // Update .env file
    $envPath = __DIR__ . '/backend/.env';
    
    // Create .env if it doesn't exist
    if (!file_exists($envPath)) {
        copy(__DIR__ . '/backend/.env.example', $envPath);
    }
    
    // Read and update .env
    $envContent = file_get_contents($envPath);
    
    $updates = [
        'DB_CONNECTION' => 'mysql',
        'DB_HOST' => '127.0.0.1',
        'DB_PORT' => '3306',
        'DB_DATABASE' => 'video_hosting',
        'DB_USERNAME' => 'root',
        'DB_PASSWORD' => '88888888'
    ];
    
    foreach ($updates as $key => $value) {
        $pattern = "/^{$key}=.*/m";
        $replacement = "{$key}={$value}";
        
        if (preg_match($pattern, $envContent)) {
            $envContent = preg_replace($pattern, $replacement, $envContent);
        } else {
            $envContent .= "\n{$replacement}";
        }
    }
    
    file_put_contents($envPath, $envContent);
    
    // Run migrations
    $output = [];
    chdir(__DIR__ . '/backend');
    
    // Clear configuration cache
    exec('php artisan config:clear', $output, $returnVar);
    
    // Run migrations
    exec('php artisan migrate --force', $output, $returnVar);
    
    echo "Database setup completed successfully!\n";
    echo "Migration output:\n" . implode("\n", $output) . "\n";
    
} catch (PDOException $e) {
    die("Error setting up database: " . $e->getMessage() . "\n");
}

echo "Setup completed! You can now access your application.\n";
