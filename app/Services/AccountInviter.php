<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\AccountInvitation;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AccountInviter
{
    public function invite(User $user): void
    {
        $user->notify(new AccountInvitation($user->role->label()));
    }

    /**
     * Create an unusable password placeholder for an invited user who hasn't set one yet.
     */
    public function unusablePassword(): string
    {
        return Hash::make(Str::random(40));
    }
}
