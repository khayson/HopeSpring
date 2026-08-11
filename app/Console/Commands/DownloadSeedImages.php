<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

#[Signature('app:download-seed-images {--force : Re-download images that already exist}')]
#[Description('Download placeholder seed images into public storage for local development')]
class DownloadSeedImages extends Command
{
    /**
     * Seed image destinations keyed by relative path under the public disk.
     * Values are [width, height] used with picsum.photos.
     *
     * @return array<string, array{0: int, 1: int}>
     */
    public static function manifest(): array
    {
        return [
            // Gallery — varied aspect ratios for masonry
            'gallery/01.jpg' => [800, 1000],
            'gallery/02.jpg' => [800, 600],
            'gallery/03.jpg' => [800, 900],
            'gallery/04.jpg' => [800, 700],
            'gallery/05.jpg' => [800, 1100],
            'gallery/06.jpg' => [800, 600],
            'gallery/07.jpg' => [800, 850],
            'gallery/08.jpg' => [800, 750],
            'gallery/09.jpg' => [800, 950],
            'gallery/10.jpg' => [800, 650],
            'gallery/11.jpg' => [800, 800],
            'gallery/12.jpg' => [800, 1050],
            'gallery/13.jpg' => [800, 700],
            'gallery/14.jpg' => [800, 900],
            'gallery/15.jpg' => [800, 600],
            'gallery/16.jpg' => [800, 1000],

            // Programmes
            'programmes/clean-water-initiative.jpg' => [1200, 800],
            'programmes/education-for-all.jpg' => [1200, 800],
            'programmes/healthcare-outreach.jpg' => [1200, 800],
            'programmes/community-development.jpg' => [1200, 800],

            // Projects
            'projects/bongo-district-borehole-network.jpg' => [1200, 800],
            'projects/tamale-peri-urban-water-scheme.jpg' => [1200, 800],
            'projects/keta-lagoon-rainwater-harvesting.jpg' => [1200, 800],
            'projects/yendi-girls-scholarship-fund.jpg' => [1200, 800],
            'projects/assin-fosu-classroom-block.jpg' => [1200, 800],
            'projects/upper-west-teacher-training.jpg' => [1200, 800],
            'projects/northern-region-mobile-clinics.jpg' => [1200, 800],
            'projects/afram-plains-bed-net-campaign.jpg' => [1200, 800],
            'projects/volta-region-chps-restocking.jpg' => [1200, 800],
            'projects/nkoranza-womens-savings-group.jpg' => [1200, 800],
            'projects/sefwi-wiawso-community-centre.jpg' => [1200, 800],
            'projects/navrongo-agricultural-extension.jpg' => [1200, 800],

            // Posts
            'posts/clean-water-reaches-bongo.jpg' => [1200, 675],
            'posts/yendi-girls-reach-shs.jpg' => [1200, 675],
            'posts/mobile-clinics-9000-consultations.jpg' => [1200, 675],
            'posts/sefwi-wiawso-centre-opens.jpg' => [1200, 675],
            'posts/bed-net-campaign-results.jpg' => [1200, 675],
            'posts/nkoranza-savings-group-payout.jpg' => [1200, 675],
            'posts/assin-fosu-classroom-block-handover.jpg' => [1200, 675],
            'posts/tamale-water-changli-standpipe.jpg' => [1200, 675],
            'posts/upper-west-teacher-training-launch.jpg' => [1200, 675],
            'posts/keta-rainwater-harvesting-lessons.jpg' => [1200, 675],
            'posts/navrongo-farmers-crop-trials.jpg' => [1200, 675],

            // Team (portrait)
            'team/kwame-asante.jpg' => [600, 750],
            'team/ama-mensah.jpg' => [600, 750],
            'team/kofi-darko.jpg' => [600, 750],
            'team/abiba-mahama.jpg' => [600, 750],
            'team/salifu-abdulai.jpg' => [600, 750],
            'team/mercy-owusu.jpg' => [600, 750],
            'team/yaa-serwaa.jpg' => [600, 750],
            'team/emmanuel-tetteh.jpg' => [600, 750],
            'team/naana-agyemang.jpg' => [600, 750],
            'team/samuel-quartey.jpg' => [600, 750],
            'team/patience-boateng.jpg' => [600, 750],
            'team/nana-kwadwo-agyei.jpg' => [600, 750],

            // Events
            'events/2026-annual-fundraising-gala.jpg' => [1200, 800],
            'events/tamale-health-screening-q4-2026.jpg' => [1200, 800],
            'events/back-to-school-supply-drive-2026.jpg' => [1200, 800],
            'events/2025-stakeholder-meeting.jpg' => [1200, 800],
            'events/world-water-day-2025.jpg' => [1200, 800],
            'events/2024-fundraising-gala.jpg' => [1200, 800],
            'events/sefwi-wiawso-centre-opening.jpg' => [1200, 800],

            // Partner logos (square)
            'partners/unicef-ghana.jpg' => [400, 200],
            'partners/world-vision.jpg' => [400, 200],
            'partners/ghana-health-service.jpg' => [400, 200],
            'partners/wateraid.jpg' => [400, 200],
            'partners/ghana-education-service.jpg' => [400, 200],
            'partners/mtn-ghana-foundation.jpg' => [400, 200],
        ];
    }

    public function handle(): int
    {
        $disk = Storage::disk('public');
        $force = (bool) $this->option('force');
        $downloaded = 0;
        $skipped = 0;
        $failed = 0;

        foreach (self::manifest() as $path => [$width, $height]) {
            if ($disk->exists($path) && ! $force) {
                $skipped++;

                continue;
            }

            $seed = 'hs-'.str_replace(['/', '.'], '-', $path);
            $url = "https://picsum.photos/seed/{$seed}/{$width}/{$height}";

            $this->components->task($path, function () use ($disk, $path, $url, &$downloaded, &$failed): bool {
                try {
                    $response = Http::timeout(15)
                        ->connectTimeout(5)
                        ->retry([200, 500, 1000])
                        ->withHeaders(['Accept' => 'image/*'])
                        ->get($url);

                    if ($response->failed()) {
                        $failed++;

                        return false;
                    }

                    $directory = dirname($path);

                    if ($directory !== '.' && ! $disk->exists($directory)) {
                        $disk->makeDirectory($directory);
                    }

                    $disk->put($path, $response->body());
                    $downloaded++;

                    return true;
                } catch (\Throwable) {
                    $failed++;

                    return false;
                }
            });
        }

        $this->newLine();
        $this->info("Downloaded: {$downloaded} · Skipped: {$skipped} · Failed: {$failed}");

        return $failed > 0 ? self::FAILURE : self::SUCCESS;
    }
}
