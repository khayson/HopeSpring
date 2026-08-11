<?php

namespace App\Models;

use Database\Factories\DonationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int|null $user_id
 * @property string $donor_name
 * @property string $donor_email
 * @property string|null $donor_phone
 * @property int $amount
 * @property string $currency
 * @property string $reference
 * @property string $method
 * @property string $status
 * @property string|null $paystack_reference
 * @property bool $is_recurring
 * @property int|null $programme_id
 * @property int|null $event_id
 * @property string|null $programme
 * @property string|null $message
 * @property bool $is_anonymous
 */
#[Fillable([
    'user_id',
    'donor_name',
    'donor_email',
    'donor_phone',
    'amount',
    'currency',
    'reference',
    'method',
    'status',
    'paystack_reference',
    'is_recurring',
    'programme_id',
    'event_id',
    'programme',
    'message',
    'is_anonymous',
])]
#[Hidden(['paystack_reference'])]
class Donation extends Model
{
    /** @use HasFactory<DonationFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'is_recurring' => 'boolean',
            'is_anonymous' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function fundedProgramme(): BelongsTo
    {
        return $this->belongsTo(Programme::class, 'programme_id');
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
