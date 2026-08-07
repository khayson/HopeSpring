<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DonateController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\GetInvolvedController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\InviteController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\PortalController;
use App\Http\Controllers\ProgrammeController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/about', AboutController::class)->name('about');

Route::get('/programmes', [ProgrammeController::class, 'index'])->name('programmes.index');
Route::get('/programmes/{programme:slug}', [ProgrammeController::class, 'show'])->name('programmes.show');

Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
Route::get('/projects/{project:slug}', [ProjectController::class, 'show'])->name('projects.show');

Route::get('/get-involved', GetInvolvedController::class)->name('get-involved');
Route::get('/get-involved/volunteer', [InquiryController::class, 'volunteer'])->name('get-involved.volunteer');
Route::get('/get-involved/partner', [InquiryController::class, 'partner'])->name('get-involved.partner');
Route::post('/get-involved/{type}', [InquiryController::class, 'store'])
    ->where('type', 'volunteer|partner')
    ->name('get-involved.store');

Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('/news/{post:slug}', [NewsController::class, 'show'])->name('news.show');

Route::get('/events', [EventController::class, 'index'])->name('events.index');
Route::get('/events/{event:slug}', [EventController::class, 'show'])->name('events.show');

Route::get('/gallery', GalleryController::class)->name('gallery');
Route::get('/contact', [ContactController::class, 'show'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::get('/donate', DonateController::class)->name('donate');
Route::post('/donate', [DonateController::class, 'store'])->name('donate.store');
Route::get('/donate/callback', [DonateController::class, 'callback'])->name('donate.callback');

Route::post('/newsletter/subscribe', [NewsletterController::class, 'store'])->name('newsletter.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('portal', PortalController::class)->middleware('role:volunteer,partner')->name('portal.index');
});

Route::middleware(['guest', 'signed'])->group(function () {
    Route::get('invite/{user}/accept', [InviteController::class, 'show'])->name('invite.accept');
    Route::post('invite/{user}/accept', [InviteController::class, 'store'])->name('invite.store');
});

if (app()->environment('local')) {
    Route::inertia('styleguide', 'styleguide')->name('styleguide');
}

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
