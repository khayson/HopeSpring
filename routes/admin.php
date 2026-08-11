<?php

use App\Http\Controllers\Admin\ContactMessageController;
use App\Http\Controllers\Admin\DonationController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\InquiryController;
use App\Http\Controllers\Admin\NewsletterSubscriberController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin,editor,finance'])->prefix('admin')->name('admin.')->group(function () {
    Route::middleware('role:admin,finance')->group(function () {
        Route::get('donations', [DonationController::class, 'index'])->name('donations.index');
        Route::get('donations/{donation}', [DonationController::class, 'show'])->name('donations.show');
    });

    Route::middleware('role:admin,editor')->group(function () {
        Route::resource('events', EventController::class)->except('show');
        Route::resource('posts', PostController::class)->except('show');
    });

    Route::middleware('role:admin')->group(function () {
        Route::get('messages', [ContactMessageController::class, 'index'])->name('messages.index');
        Route::get('messages/{message}', [ContactMessageController::class, 'show'])->name('messages.show');
        Route::delete('messages/{message}', [ContactMessageController::class, 'destroy'])->name('messages.destroy');

        Route::get('newsletter', [NewsletterSubscriberController::class, 'index'])->name('newsletter.index');
        Route::delete('newsletter/{subscriber}', [NewsletterSubscriberController::class, 'destroy'])->name('newsletter.destroy');

        Route::get('inquiries', [InquiryController::class, 'index'])->name('inquiries.index');
        Route::get('inquiries/{inquiry}', [InquiryController::class, 'show'])->name('inquiries.show');
        Route::patch('inquiries/{inquiry}', [InquiryController::class, 'update'])->name('inquiries.update');
        Route::post('inquiries/{inquiry}/invite', [InquiryController::class, 'invite'])->name('inquiries.invite');

        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::get('users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::post('users/{user}/resend-invite', [UserController::class, 'resendInvite'])->name('users.resend-invite');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        Route::get('settings', [SettingController::class, 'edit'])->name('settings.edit');
        Route::put('settings', [SettingController::class, 'update'])->name('settings.update');
    });
});
