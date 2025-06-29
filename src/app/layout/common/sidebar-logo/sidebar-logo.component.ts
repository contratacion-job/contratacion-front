import { NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AppConfigService, AppCustomization } from '../../../services/app-config.service';

@Component({
    selector: 'sidebar-logo',
    template: `
        <div class="flex items-center">
            <img [src]="logoSrc"
                 [alt]="logoAlt"
                 [class]="logoClass"
                 (error)="onImageError($event)">
            <span *ngIf="showCompanyName"
                  class="ml-3 text-lg font-semibold text-white">
                {{companyName}}
            </span>
        </div>
    `,
    standalone: true,
    imports: [NgIf]
})
export class SidebarLogoComponent implements OnInit, OnDestroy {
    @Input() logoClass: string = 'h-8 w-auto';
    @Input() showCompanyName: boolean = true;
    @Input() fallbackLogo: string = 'assets/logo.jpg';

    logoSrc: string = 'assets/logo.jpg';
    logoAlt: string = 'Logo';
    companyName: string = 'Sistema de Contratación';

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private _appConfigService: AppConfigService) {}

    ngOnInit(): void {
        // Suscribirse a cambios de configuración
        this._appConfigService.customization$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: AppCustomization) => {
                this.logoSrc = config.logo;
                this.logoAlt = config.companyName;
                this.companyName = config.companyName;
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
