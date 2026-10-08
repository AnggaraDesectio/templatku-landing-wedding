<?php

// Di-generate oleh php artisan template:zip - hanya berisi flavor "landing-wedding".
// Ganti brand/warna di bawah, atau set TEMPLATE_FLAVOR di .env.

return [
    'flavor' => env('TEMPLATE_FLAVOR', 'landing-wedding'),

    'flavors' => array (
  'landing-wedding' => 
  array (
    'label' => 'BAHAGIA WEDDING ORGANIZER — Wedding Organizer',
    'brand_name' => 'BAHAGIA WEDDING ORGANIZER',
    'brand_tagline' => 'Hari bahagiamu, kami yang urus',
    'brand_initials' => 'BW',
    'accent' => '#831843',
    'category' => 'kreatif',
    'home' => 'landings.wedding',
    'nav' => 
    array (
      'sections' => 
      array (
        0 => 
        array (
          'label' => 'Menu',
          'items' => 
          array (
            0 => 
            array (
              'label' => 'Landing',
              'to' => '/landings/wedding',
              'icon' => 'Home',
            ),
            1 => 
            array (
              'label' => 'Dashboard',
              'to' => '/dashboard',
              'icon' => 'LayoutDashboard',
            ),
            2 => 
            array (
              'label' => 'Pengaturan',
              'to' => '/settings',
              'icon' => 'Settings',
            ),
          ),
        ),
      ),
    ),
  ),
),
];
