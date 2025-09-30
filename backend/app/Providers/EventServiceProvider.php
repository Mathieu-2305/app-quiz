<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use SocialiteProviders\Manager\SocialiteWasCalled;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        // Registers the Microsoft Azure provider
        SocialiteWasCalled::class => [
            'SocialiteProviders\\Microsoft-Azure\\AzureExtendSocialite@handle',
        ],
    ];
}