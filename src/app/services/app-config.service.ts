import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppCustomization {
    logo: string;
    companyName: string;
    primaryColor: string;
    secondaryColor: string;
}

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    private defaultConfig: AppCustomization = {
        logo: 'assets/logo.jpg',
        companyName: 'Sistema de Contratación',
        primaryColor: '#2196F3',
        secondaryColor: '#757575'
    };

    private _customization = new BehaviorSubject<AppCustomization>(this.defaultConfig);

    constructor() {}

    // Observable para que los componentes se suscriban a cambios
    get customization$(): Observable<AppCustomization> {
        return this._customization.asObservable();
    }

    // Getter para obtener la configuración actual
    get currentCustomization(): AppCustomization {
        return this._customization.value;
    }

    // Actualizar configuración
    updateCustomization(config: Partial<AppCustomization>): void {
        const currentConfig = this._customization.value;
        this._customization.next({ ...currentConfig, ...config });
    }

    // Actualizar solo el logo
    updateLogo(logoPath: string): void {
        this.updateCustomization({ logo: logoPath });
    }

    // Actualizar solo el color primario
    updatePrimaryColor(color: string): void {
        this.updateCustomization({ primaryColor: color });
        this.applyCustomColor(color);
    }

    // Actualizar solo el nombre de la empresa
    updateCompanyName(name: string): void {
        this.updateCustomization({ companyName: name });
    }

    // Restablecer configuración
    resetConfiguration(): void {
        this._customization.next(this.defaultConfig);
        this.saveConfiguration(this.defaultConfig);
        localStorage.removeItem('admin-user-configuration');
        localStorage.removeItem('admin-user-customization');
        this.applyCustomColor(this.defaultConfig.primaryColor);
    }

    // Cargar configuración desde localStorage
    private loadConfiguration(): void {
        try {
            // Intentar cargar configuración completa
            const savedConfig = localStorage.getItem('admin-user-configuration');
            if (savedConfig) {
                const config = JSON.parse(savedConfig);
                if (config.customization) {
                    this._customization.next(config.customization);
                    this.applyCustomColor(config.customization.primaryColor);
                    return;
                }
            }

            // Fallback: cargar configuración antigua
            const savedCustomization = localStorage.getItem('admin-user-customization');
            if (savedCustomization) {
                const customization = JSON.parse(savedCustomization);
                this._customization.next(customization);
                this.applyCustomColor(customization.primaryColor);
            }
        } catch (error) {
            console.error('Error loading configuration:', error);
            this._customization.next(this.defaultConfig);
        }
    }

    // Guardar configuración en localStorage
    private saveConfiguration(config: AppCustomization): void {
        try {
            const configToSave = {
                customization: config,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('admin-user-configuration', JSON.stringify(configToSave));
            localStorage.setItem('admin-user-customization', JSON.stringify(config));
        } catch (error) {
            console.error('Error saving configuration:', error);
        }
    }

    // Aplicar color personalizado
    private applyCustomColor(color: string): void {
        const root = document.documentElement;

        // Convertir hex a RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // Aplicar colores CSS personalizados
        root.style.setProperty('--custom-primary', color);
        root.style.setProperty('--custom-primary-rgb', `${r}, ${g}, ${b}`);

        // Generar variaciones del color
        const variations = this.generateColorVariations(color);
        Object.entries(variations).forEach(([key, value]) => {
            root.style.setProperty(`--custom-${key}`, value);
        });

        // Aplicar al sidebar y otros elementos
        root.style.setProperty('--sidebar-bg', color);
        root.style.setProperty('--sidebar-bg-hover', variations['primary-600']);
        root.style.setProperty('--sidebar-text', '#ffffff');
        root.style.setProperty('--sidebar-text-secondary', 'rgba(255, 255, 255, 0.7)');
    }

    private generateColorVariations(baseColor: string): Record<string, string> {
        return {
            'primary-50': this.adjustColor(baseColor, 0.95),
            'primary-100': this.adjustColor(baseColor, 0.9),
            'primary-200': this.adjustColor(baseColor, 0.8),
            'primary-300': this.adjustColor(baseColor, 0.6),
            'primary-400': this.adjustColor(baseColor, 0.3),
            'primary-500': baseColor,
            'primary-600': this.adjustColor(baseColor, -0.1),
            'primary-700': this.adjustColor(baseColor, -0.2),
            'primary-800': this.adjustColor(baseColor, -0.3),
            'primary-900': this.adjustColor(baseColor, -0.4),
        };
    }

    private adjustColor(color: string, factor: number): string {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        const adjust = (value: number) => {
            if (factor > 0) {
                return Math.round(value + (255 - value) * factor);
            } else {
                return Math.round(value * (1 + factor));
            }
        };

        const newR = Math.max(0, Math.min(255, adjust(r)));
        const newG = Math.max(0, Math.min(255, adjust(g)));
        const newB = Math.max(0, Math.min(255, adjust(b)));

        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
}
