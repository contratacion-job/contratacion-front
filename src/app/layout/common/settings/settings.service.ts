import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LogoConfig {
    logoSrc: string;
    backgroundColor: string;
}

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private _logoConfigSubject = new BehaviorSubject<LogoConfig>({
        logoSrc: 'assets/logo.jpg', // logo actual
        backgroundColor: '#111827' // color actual del sidebar (bg-gray-900)
    });

    logoConfig$ = this._logoConfigSubject.asObservable();

    private _mockConfigs: LogoConfig[] = [
        { logoSrc: 'assets/logo.jpg', backgroundColor: 'rebeccapurple' }, // solo este cambia a rebeccapurple
        { logoSrc: 'assets/images/logo/logo.svg', backgroundColor: '#111827' }, // color actual sidebar
        { logoSrc: 'assets/admin.png', backgroundColor: '#111827' } // color actual sidebar
    ];

    get mockConfigs(): LogoConfig[] {
        return this._mockConfigs;
    }

    setLogoConfig(config: LogoConfig): void {
        this._logoConfigSubject.next(config);
    }
}
