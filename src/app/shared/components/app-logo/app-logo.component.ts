import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AppConfigService, AppCustomization } from '../../../services/app-config.service';

@Component({
    selector: 'app-logo',
    template: `
        <img [src]="logoSrc"
             [alt]="logoAlt"
             [class]="logoClass"
             (error)="onImageError($event)">
    `,
    standalone: true
})
export class AppLogoComponent implements OnInit, OnDestroy {
    @Input() logoClass: string = 'w-12';
    @Input() fallbackLogo: string = 'assets/logo.jpg';

    logoSrc: string = 'assets/logo.jpg';
    logoAlt: string = 'Logo';

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private _appConfigService: AppConfigService) {}

    ngOnInit(): void {
        // Suscribirse a cambios de configuración
        this._appConfigService.customization$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: AppCustomization) => {
                this.logoSrc = config.logo;
                this.logoAlt = config.companyName;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onImageError(event: any): void {
        event.target.src = this.fallbackLogo;
    }
}
