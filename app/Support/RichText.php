<?php

namespace App\Support;

class RichText
{
    public static function sanitize(?string $html): ?string
    {
        if ($html === null) {
            return null;
        }

        $trimmed = trim($html);

        if ($trimmed === '' || $trimmed === '<p></p>') {
            return null;
        }

        $withoutScripts = preg_replace('#<(script|style|iframe|object|embed)[^>]*>.*?</\1>#is', '', $trimmed) ?? $trimmed;
        $clean = strip_tags($withoutScripts, '<p><br><strong><b><em><i><u><ul><ol><li><a><h2><h3><blockquote>');
        $clean = preg_replace('/\s+on\w+\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+)/i', '', $clean) ?? $clean;
        $clean = preg_replace('/href\s*=\s*([\'"])\s*javascript:[^\'"]*\1/i', 'href="#"', $clean) ?? $clean;

        $clean = trim($clean);

        return $clean === '' || $clean === '<p></p>' ? null : $clean;
    }
}
