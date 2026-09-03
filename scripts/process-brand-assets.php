<?php

declare(strict_types=1);

/**
 * Process HopeSpring brand master files into transparent PNGs, marks, and favicons.
 *
 * Masters live in public/images/brand/raw/ (JPEG or PNG on black).
 * Outputs overwrite public/images/brand/*.png and public favicon/manifest icons.
 */
function loadImage(string $path): GdImage
{
    $info = getimagesize($path);

    if ($info === false) {
        throw new RuntimeException("Unable to inspect {$path}");
    }

    $img = match ($info['mime'] ?? '') {
        'image/png' => imagecreatefrompng($path),
        'image/jpeg' => imagecreatefromjpeg($path),
        'image/webp' => function_exists('imagecreatefromwebp') ? imagecreatefromwebp($path) : false,
        default => false,
    };

    if ($img === false) {
        throw new RuntimeException("Unable to load {$path}");
    }

    imagealphablending($img, false);
    imagesavealpha($img, true);

    return $img;
}

function savePng(GdImage $img, string $path): void
{
    imagealphablending($img, false);
    imagesavealpha($img, true);
    imagepng($img, $path, 6);
}

/**
 * Key near-achromatic black to transparency without removing dark navy wordmark ink.
 */
function removeNearBlack(GdImage $src, int $threshold = 48): GdImage
{
    $width = imagesx($src);
    $height = imagesy($src);
    $dst = imagecreatetruecolor($width, $height);
    imagealphablending($dst, false);
    imagesavealpha($dst, true);
    $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
    imagefilledrectangle($dst, 0, 0, $width, $height, $transparent);

    for ($y = 0; $y < $height; $y++) {
        for ($x = 0; $x < $width; $x++) {
            $rgba = imagecolorat($src, $x, $y);
            $alpha = ($rgba & 0x7F000000) >> 24;
            $red = ($rgba >> 16) & 0xFF;
            $green = ($rgba >> 8) & 0xFF;
            $blue = $rgba & 0xFF;
            $luma = (int) round(0.2126 * $red + 0.7152 * $green + 0.0722 * $blue);
            $isNearBlack = $luma <= $threshold
                && abs($red - $green) < 12
                && abs($green - $blue) < 12
                && abs($red - $blue) < 12;

            if ($alpha >= 120 || $isNearBlack) {
                imagesetpixel($dst, $x, $y, $transparent);

                continue;
            }

            $color = imagecolorallocatealpha($dst, $red, $green, $blue, $alpha);
            imagesetpixel($dst, $x, $y, $color);
        }
    }

    return $dst;
}

/**
 * @return array{minX:int,minY:int,maxX:int,maxY:int}
 */
function contentBBox(GdImage $src, int $alphaCutoff = 100): array
{
    $width = imagesx($src);
    $height = imagesy($src);
    $minX = $width;
    $minY = $height;
    $maxX = 0;
    $maxY = 0;

    for ($y = 0; $y < $height; $y++) {
        for ($x = 0; $x < $width; $x++) {
            $alpha = (imagecolorat($src, $x, $y) & 0x7F000000) >> 24;

            if ($alpha < $alphaCutoff) {
                $minX = min($minX, $x);
                $minY = min($minY, $y);
                $maxX = max($maxX, $x);
                $maxY = max($maxY, $y);
            }
        }
    }

    if ($maxX < $minX) {
        throw new RuntimeException('No opaque content found.');
    }

    return compact('minX', 'minY', 'maxX', 'maxY');
}

function trimToContent(GdImage $src, float $padRatio = 0.04): GdImage
{
    $box = contentBBox($src);
    $contentW = $box['maxX'] - $box['minX'] + 1;
    $contentH = $box['maxY'] - $box['minY'] + 1;
    $pad = (int) max(4, round(max($contentW, $contentH) * $padRatio));
    $dstW = $contentW + ($pad * 2);
    $dstH = $contentH + ($pad * 2);

    $dst = imagecreatetruecolor($dstW, $dstH);
    imagealphablending($dst, false);
    imagesavealpha($dst, true);
    $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
    imagefilledrectangle($dst, 0, 0, $dstW, $dstH, $transparent);
    imagecopy($dst, $src, $pad, $pad, $box['minX'], $box['minY'], $contentW, $contentH);

    return $dst;
}

/**
 * Horizontal logos: emblem is the left square of the content bbox.
 */
function extractMarkFromHorizontal(GdImage $src, float $padRatio = 0.06): GdImage
{
    $box = contentBBox($src);
    $contentH = $box['maxY'] - $box['minY'] + 1;
    $size = $contentH;
    $srcX = $box['minX'];
    $srcY = $box['minY'];

    $dst = imagecreatetruecolor($size, $size);
    imagealphablending($dst, false);
    imagesavealpha($dst, true);
    $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
    imagefilledrectangle($dst, 0, 0, $size, $size, $transparent);

    $inner = (int) round($size * (1 - $padRatio * 2));
    $offset = (int) round(($size - $inner) / 2);
    imagecopyresampled(
        $dst,
        $src,
        $offset,
        $offset,
        $srcX,
        $srcY,
        $inner,
        $inner,
        $size,
        $size,
    );

    return $dst;
}

function resizeSquare(GdImage $src, int $size): GdImage
{
    $dst = imagecreatetruecolor($size, $size);
    imagealphablending($dst, false);
    imagesavealpha($dst, true);
    $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
    imagefilledrectangle($dst, 0, 0, $size, $size, $transparent);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $size, $size, imagesx($src), imagesy($src));

    return $dst;
}

$brand = __DIR__.'/../public/images/brand';
$raw = "{$brand}/raw";

if (! is_dir($raw)) {
    throw new RuntimeException("Missing raw brand masters at {$raw}");
}

$masters = [
    'logo-primary' => "{$raw}/logo-primary.png",
    'logo-mono' => "{$raw}/logo-mono.png",
    'logo-stacked' => "{$raw}/logo-stacked.png",
    'logo-stacked-mono' => "{$raw}/logo-stacked-mono.png",
];

foreach ($masters as $name => $path) {
    if (! is_file($path)) {
        throw new RuntimeException("Missing master: {$path}");
    }
}

$primary = trimToContent(removeNearBlack(loadImage($masters['logo-primary'])));
$mono = trimToContent(removeNearBlack(loadImage($masters['logo-mono'])));
$stacked = trimToContent(removeNearBlack(loadImage($masters['logo-stacked'])));
$stackedMono = trimToContent(removeNearBlack(loadImage($masters['logo-stacked-mono'])));

savePng($primary, "{$brand}/logo-primary.png");
savePng($mono, "{$brand}/logo-mono.png");
savePng($stacked, "{$brand}/logo-stacked.png");
savePng($stackedMono, "{$brand}/logo-stacked-mono.png");

$keyedPrimary = removeNearBlack(loadImage($masters['logo-primary']));
$keyedMono = removeNearBlack(loadImage($masters['logo-mono']));
$mark = extractMarkFromHorizontal($keyedPrimary);
$markMono = extractMarkFromHorizontal($keyedMono);
savePng($mark, "{$brand}/mark.png");
savePng($markMono, "{$brand}/mark-mono.png");

foreach ([16, 32, 48, 180, 192, 512] as $size) {
    savePng(resizeSquare($mark, $size), "{$brand}/icon-{$size}.png");
}

$public = __DIR__.'/../public';
copy("{$brand}/icon-16.png", "{$public}/favicon-16x16.png");
copy("{$brand}/icon-32.png", "{$public}/favicon-32x32.png");
copy("{$brand}/icon-180.png", "{$public}/apple-touch-icon.png");
copy("{$brand}/icon-192.png", "{$public}/android-chrome-192x192.png");
copy("{$brand}/icon-512.png", "{$public}/android-chrome-512x512.png");
copy("{$brand}/icon-32.png", "{$public}/favicon.png");
copy("{$brand}/icon-32.png", "{$public}/favicon.ico");

file_put_contents("{$public}/site.webmanifest", json_encode([
    'name' => 'HopeSpring Foundation',
    'short_name' => 'HopeSpring',
    'description' => 'Transforming Lives',
    'start_url' => '/',
    'display' => 'standalone',
    'background_color' => '#0B1F3A',
    'theme_color' => '#0B1F3A',
    'icons' => [
        [
            'src' => '/android-chrome-192x192.png',
            'sizes' => '192x192',
            'type' => 'image/png',
        ],
        [
            'src' => '/android-chrome-512x512.png',
            'sizes' => '512x512',
            'type' => 'image/png',
        ],
    ],
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)."\n");

echo "Brand assets processed.\n";
