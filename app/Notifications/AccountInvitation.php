<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class AccountInvitation extends Notification
{
    public function __construct(private readonly string $roleLabel) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = URL::temporarySignedRoute(
            'invite.accept',
            now()->addDays(7),
            ['user' => $notifiable->getKey()],
        );

        return (new MailMessage)
            ->subject('You’ve been invited to HopeSpring Foundation')
            ->greeting("Hi {$notifiable->name},")
            ->line("You've been invited to join HopeSpring Foundation as a {$this->roleLabel}.")
            ->action('Set up your account', $url)
            ->line('This invite link expires in 7 days.');
    }
}
