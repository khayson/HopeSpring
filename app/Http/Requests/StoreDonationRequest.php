<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDonationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'donor_name' => ['required', 'string', 'max:255'],
            'donor_email' => ['required', 'email', 'max:255'],
            'donor_phone' => ['nullable', 'string', 'max:20'],
            'amount' => ['required', 'integer', 'min:100'],
            'programme_id' => [
                'nullable',
                'integer',
                'prohibits:event_id',
                Rule::exists('programmes', 'id')->where('is_active', true),
            ],
            'event_id' => [
                'nullable',
                'integer',
                'prohibits:programme_id',
                Rule::exists('events', 'id'),
            ],
            'message' => ['nullable', 'string', 'max:1000'],
            'is_anonymous' => ['boolean'],
        ];
    }
}
