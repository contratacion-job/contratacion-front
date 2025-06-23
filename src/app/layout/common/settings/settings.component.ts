import { NgClass, NgFor } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { FuseConfig, FuseConfigService, Scheme, Theme, Themes } from '@fuse/services/config';

import { Subject, takeUntil } from 'rxjs';
import { SettingsService, LogoConfig } from './settings.service';

@Component({
    selector     : 'settings',
    templateUrl  : './settings.component.html',
    styles       : [
        `
            settings {
                position: static;
                display: block;
                flex: none;
                width: auto;
            }

            @media (screen and min-width: 1280px) {

                empty-layout + settings .settings-cog {
                    right: 0 !important;
                }
            }
            .logo-option {
                cursor: pointer;
                border: 2px solid transparent;
                padding: 4px;
                border-radius: 4px;
                display: inline-block;
                margin-right: 8px;
            }
            .logo-option.selected {
                border-color: #3b82f6; /* azul */
            }
            .color-box {
                width: 24px;
                height: 24px;
                border-radius: 4px;
                display: inline-block;
                vertical-align: middle;
                margin-left: 8px;
                border: 1px solid #ccc;
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [MatIconModule, FuseDrawerComponent, MatButtonModule, NgFor, NgClass, MatTooltipModule],
})
export class SettingsComponent implements OnInit, OnDestroy
{
    config: FuseConfig;
    layout: string;
    scheme: 'dark' | 'light';
    theme: string;
    themes: Themes;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    logoConfigs: LogoConfig[];
    selectedLogoConfig: LogoConfig;

    constructor(
        private _router: Router,
        private _fuseConfigService: FuseConfigService,
        private _settingsService: SettingsService
    )
    {
        this.logoConfigs = this._settingsService.mockConfigs;
        this.selectedLogoConfig = this.logoConfigs[0];
    }

    ngOnInit(): void
    {
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: FuseConfig) =>
            {
                this.config = config;
            });
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    selectLogoConfig(config: LogoConfig): void {
        this.selectedLogoConfig = config;
        this._settingsService.setLogoConfig(config);
    }

    setLayout(layout: string): void
    {
        this._router.navigate([], {
            queryParams        : {
                layout: null,
            },
            queryParamsHandling: 'merge',
        }).then(() =>
        {
            this._fuseConfigService.config = {layout};
        });
    }

    setScheme(scheme: Scheme): void
    {
        this._fuseConfigService.config = {scheme};
    }

    setTheme(theme: Theme): void
    {
        this._fuseConfigService.config = {theme};
    }
}
