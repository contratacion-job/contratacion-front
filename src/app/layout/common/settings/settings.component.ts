import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { FuseConfig, FuseConfigService } from '@fuse/services/config';
import { ThemeCustomizationService } from 'app/services/theme-customization.service';

// Interfaces
interface ThemeCustomization {
    primaryColor: string;
    logo: string;
    companyName: string;
    userId?: string;
    sidebarColor?: string;
}

interface ColorOption {
    id: string;
    name: string;
    color: string;
}

interface LogoOption {
    id: string;
    name: string;
    path: string;
}

interface ThemeOption {
    id: string;
    name: string;
}

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        FuseDrawerComponent
    ],
})
export class SettingsComponent implements OnInit, OnDestroy {
    config: FuseConfig;
    showSaveNotification: boolean = false;

    customization: ThemeCustomization = {
        primaryColor: '#9C27B0',
        sidebarColor: localStorage.getItem('sidebarColor') || '#9C27B0',
        logo: 'assets/logo.jpg',
        companyName: 'Sistema de Contratación'
    };

    // Temas disponibles
    availableThemes: ThemeOption[] = [
        { id: 'theme-default', name: 'Por Defecto' },
        { id: 'theme-brand', name: 'Brand' },
        { id: 'theme-teal', name: 'Teal' },
        { id: 'theme-rose', name: 'Rosa' },
        { id: 'theme-purple', name: 'Púrpura' },
        { id: 'theme-amber', name: 'Ámbar' },
        { id: 'theme-red', name: 'Rojo' },
        { id: 'theme-green', name: 'Verde' }
    ];

    // Colores predefinidos
    predefinedColors: ColorOption[] = [
        { id: 'blue', name: 'Azul', color: '#2196F3' },
        { id: 'green', name: 'Verde', color: '#4CAF50' },
        { id: 'orange', name: 'Naranja', color: '#FF9800' },
        { id: 'purple', name: 'Púrpura', color: '#9C27B0' },
        { id: 'red', name: 'Rojo', color: '#F44336' },
        { id: 'teal', name: 'Teal', color: '#009688' },
        { id: 'indigo', name: 'Índigo', color: '#3F51B5' },
        { id: 'pink', name: 'Rosa', color: '#E91E63' }
    ];

    predefinedLogos: LogoOption[] = [
        { id: 'default', name: 'Logo por defecto', path: 'assets/logo.jpg' },
        { id: 'empresa1', name: 'Empresa Construcción', path: 'assets/logos/construccion.png' },
        { id: 'empresa2', name: 'Empresa Servicios', path: 'assets/logos/servicios.png' },
        { id: 'empresa3', name: 'Empresa Tecnología', path: 'assets/logos/tecnologia.png' },
        { id: 'empresa4', name: 'Empresa Salud', path: 'assets/logos/salud.png' }
    ];

    // Mapeo de colores a temas
    private colorToThemeMap: Record<string, string> = {
        '#9C27B1': 'theme-default',
        '#4CAF50': 'theme-green',
        '#FF9800': 'theme-amber',
        '#9C27B0': 'theme-purple',
        '#F44336': 'theme-red',
        '#009688': 'theme-teal',
        '#3F51B5': 'theme-indigo',
        '#E91E63': 'theme-rose'
    };

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    selectedSidebarColor: string = '#1e3a8a';

    constructor(
        private themeService:ThemeCustomizationService,
        private _fuseConfigService: FuseConfigService
    ) {}

    ngOnInit(): void {
        // Subscribe to config changes
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: FuseConfig) => {
                this.config = config;
            });

        // Load user customization from localStorage
        this.loadCustomization();
        const savedColor = localStorage.getItem('sidebarColor');
    if (savedColor) {
        this.applySidebarColor(savedColor);
    }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // Layout methods
    setLayout(layout: string): void {
        this._fuseConfigService.config = { layout };
    }

    setTheme(theme: string): void {
        this._fuseConfigService.config = { theme };

        // Obtener el color del tema y actualizar customization
        const themeColor = this.getThemeColor(theme);
        if (themeColor) {
            this.customization.primaryColor = themeColor;
            this.applyCustomColor(themeColor);
        }
    }

    setScheme(scheme: string): void {
        this._fuseConfigService.config = { scheme };
    }

    setCustomColor(color: string): void {
        this.customization.primaryColor = color;
        this.applyCustomColor(color);

        // Si el color coincide con un tema, cambiar el tema también
        const matchingTheme = this.colorToThemeMap[color];
        if (matchingTheme) {
            this._fuseConfigService.config = { theme: matchingTheme };
        }
    }

    onCustomColorChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.setCustomColor(target.value);
    }

    setCustomLogo(logoPath: string): void {
        this.customization.logo = logoPath;
    }

    onLogoUpload(event: Event): void {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (file && file.type.startsWith('image/')) {
            // Verificar tamaño del archivo (máximo 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('El archivo es demasiado grande. El tamaño máximo es 2MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                this.setCustomLogo(result);
            };
            reader.readAsDataURL(file);
        }
    }

    onImageError(event: Event): void {
        const target = event.target as HTMLImageElement;
        target.src = 'assets/logo.jpg';
    }

    onCompanyNameChange(): void {
        // Método para manejar cambios en el nombre de la empresa
        // Se puede agregar validación aquí si es necesario
    }

    // Métodos de acción
    saveConfiguration(): void {
        // Guardar toda la configuración en localStorage
        const configToSave = {
            customization: this.customization,
            fuseConfig: {
                theme: this.config.theme,
                scheme: this.config.scheme,
                layout: this.config.layout
            },
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('admin-user-configuration', JSON.stringify(configToSave));
        localStorage.setItem('admin-user-customization', JSON.stringify(this.customization));
        localStorage.setItem('admin-user-config', JSON.stringify({
            theme: this.config.theme,
            scheme: this.config.scheme,
            layout: this.config.layout
        }));

        // Mostrar notificación de guardado
        this.showSaveNotification = true;
        setTimeout(() => {
            this.showSaveNotification = false;
        }, 3000);

        console.log('Configuración guardada:', configToSave);
    }

    applyChanges(): void {
        // Aplicar todos los cambios inmediatamente
        this.applyCustomColor(this.customization.primaryColor);

        // Aplicar configuración de Fuse
        this._fuseConfigService.config = {
            theme: this.config.theme,
            scheme: this.config.scheme,
            layout: this.config.layout
        };

        // Mostrar notificación
        this.showSaveNotification = true;
        setTimeout(() => {
            this.showSaveNotification = false;
        }, 2000);
    }

    resetCustomization(): void {
        // Confirmar antes de resetear
        if (confirm('¿Estás seguro de que quieres restablecer toda la configuración a los valores por defecto?')) {
            this.customization = {
                primaryColor: '#2196F3',
                logo: 'assets/logo.jpg',
                companyName: 'Sistema de Contratación'
            };

            this.applyCustomColor('#2196F3');

            // Reset Fuse config
            this._fuseConfigService.config = {
                theme: 'theme-default',
                scheme: 'light',
                layout: 'classic'
            };

            // Limpiar localStorage
            localStorage.removeItem('admin-user-configuration');
            localStorage.removeItem('admin-user-customization');
            localStorage.removeItem('admin-user-config');

            // Mostrar notificación
            this.showSaveNotification = true;
            setTimeout(() => {
                this.showSaveNotification = false;
            }, 2000);
        }
    }

    testColorBlue(): void {
        this.applySidebarColor('#1e3a8a'); // Azul marino
    }

    testColorGreen(): void {
        this.applySidebarColor('#059669'); // Verde esmeralda
    }

    testColorPurple(): void {
        this.applySidebarColor('#9370db'); // Púrpura medio (original)
    }

    testColorOrange(): void {
        this.applySidebarColor('#ea580c'); // Naranja
    }
    testColorBlack(): void {
        this.applySidebarColor('#1e293b'); // Naranja
    }



    
    applySidebarColor(color: string): void {
        this.customization.sidebarColor = color; // ← actualiza el modelo
        console.log('Aplicando color:', color);
    
        const existing = document.getElementById('dynamic-sidebar-style');
        if (existing) {
            existing.remove();
        }
    
        const hoverColor = this.darkenColor(color, 15);
        const activeColor = this.darkenColor(color, 25);
    
        const styleElement = document.createElement('style');
        styleElement.id = 'dynamic-sidebar-style';
        styleElement.textContent = `
            .fuse-vertical-navigation-wrapper .fuse-vertical-navigation-content {
                background-color: ${color} !important;
            }
            fuse-vertical-navigation .fuse-vertical-navigation-content {
                background-color: ${color} !important;
            }
            .fuse-vertical-navigation .fuse-vertical-navigation-content {
                background-color: ${color} !important;
            }
            .fuse-vertical-navigation-wrapper .fuse-vertical-navigation-content .fuse-vertical-navigation-item:hover {
                background-color: ${hoverColor} !important;
            }
            .fuse-vertical-navigation-wrapper .fuse-vertical-navigation-content .fuse-vertical-navigation-item.fuse-vertical-navigation-item-active {
                background-color: ${activeColor} !important;
            }
        `;
    
        document.head.appendChild(styleElement);
        localStorage.setItem('sidebarColor', color); // guarda en localStorage también
    }
    
 // Método para oscurecer colores
    private darkenColor(color: string, percent: number): string {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        const factor = (100 - percent) / 100;
        const newR = Math.round(r * factor);
        const newG = Math.round(g * factor);
        const newB = Math.round(b * factor);

        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }

    isColorSelected(color: string): boolean {
        return this.selectedSidebarColor === color;
    }

    selectSidebarColor(color: ColorOption): void {
        this.selectedSidebarColor = color.color;

        // Aplicar el color directamente
        const existing = document.getElementById('sidebar-color-style');
        if (existing) {
            existing.remove();
        }

        const style = document.createElement('style');
        style.id = 'sidebar-color-style';
        style.textContent = `
            .fuse-vertical-navigation .fuse-vertical-navigation-content {
                background-color: ${color.color} !important;
            }
        `;

        document.head.appendChild(style);
    }

    getColorPreviewStyle(color: string): any {
        return {
            'background-color': color,
            'width': '40px',
            'height': '40px',
            'border-radius': '8px',
            'border': this.isColorSelected(color) ? '3px solid #1976d2' : '2px solid #e0e0e0',
            'cursor': 'pointer'
        };
    }

    // Métodos auxiliares
    getThemeColor(theme: string): string | null {
        const themeColorMap: Record<string, string> = {
            'theme-default': '#2196F3',
            'theme-brand': '#2196F3',
            'theme-teal': '#009688',
            'theme-rose': '#E91E63',
            'theme-purple': '#9C27B0',
            'theme-amber': '#FF9800',
            'theme-red': '#F44336',
            'theme-green': '#4CAF50'
        };
        return themeColorMap[theme] || null;
    }

    getThemeName(themeId: string): string {
        const theme = this.availableThemes.find(t => t.id === themeId);
        return theme ? theme.name : 'Desconocido';
    }

    private loadCustomization(): void {
        // Cargar configuración completa
        const savedConfig = localStorage.getItem('admin-user-configuration');
        if (savedConfig) {
            try {
                const config = JSON.parse(savedConfig);
                this.customization = config.customization || this.customization;

                // Aplicar configuración de Fuse si existe
                if (config.fuseConfig) {
                    this._fuseConfigService.config = config.fuseConfig;
                }

                this.applyCustomColor(this.customization.primaryColor);
                return;
            } catch (error) {
                console.error('Error loading complete configuration:', error);
            }
        }

        // Fallback: cargar configuraciones por separado
        const savedCustomization = localStorage.getItem('admin-user-customization');
        if (savedCustomization) {
            try {
                this.customization = JSON.parse(savedCustomization);
                this.applyCustomColor(this.customization.primaryColor);
            } catch (error) {
                console.error('Error loading customization:', error);
            }
        }

        const savedUserConfig = localStorage.getItem('admin-user-config');
        if (savedUserConfig) {
            try {
                const userConfig = JSON.parse(savedUserConfig);
                this._fuseConfigService.config = userConfig;
            } catch (error) {
                console.error('Error loading user config:', error);
            }
        }
    }

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

        // Aplicar al sidebar
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
                return Math.min(255, Math.round(value + (255 - value) * factor));
            } else {
                return Math.max(0, Math.round(value * (1 + factor)));
            }
        };

        const newR = adjust(r);
        const newG = adjust(g);
        const newB = adjust(b);

        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }

    private updateMaterialTheme(primaryColor: string, variations: Record<string, string>): void {
        const root = document.documentElement;

        // Actualizar variables CSS de Material Design
        Object.entries(variations).forEach(([key, value]) => {
            const matKey = key.replace('primary-', '');
            root.style.setProperty(`--mat-primary-${matKey}`, value);
        });
    }

    getCurrentThemeColor(): string {
        return this.customization.primaryColor;
    }
 
    
}

