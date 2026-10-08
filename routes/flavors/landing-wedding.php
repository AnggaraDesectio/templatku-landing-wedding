<?php

use App\Http\Controllers\Web\DemoController;
use Illuminate\Support\Facades\Route;

// Di-generate oleh php artisan template:zip dari grup "landings"
// di routes/web.php - satu-satunya rute flavor "landing-wedding".
Route::prefix('landings')->name('landings.')->group(function () {
    Route::get('/wedding', [DemoController::class, 'landingWedding'])->name('wedding');
});
