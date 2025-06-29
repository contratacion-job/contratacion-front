import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserThemeConfig {
  userId: string;
  theme: string;
  scheme: 'light' | 'dark' | 'auto';
  customPrimaryColor: string;
  logo: string;
  companyName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeStorageService {
  private readonly STORAGE_KEY = 'user-theme-config-';
  private currentUserId: string = 'admin'; // Por defecto admin

  private _themeConfig = new BehaviorSubject<UserThemeConfig>({
    userId: 'admin',
    theme: 'theme-default',
    scheme: 'light',
    customPrimaryColor: '#2196F3',
    logo: 'assets/logo.jpg',
    companyName: 'Sistema de Contratación'
  });

  public themeConfig$ = this._themeConfig.asObservable();

  // Temas disponibles con sus colores primarios
  public readonly availableThemes = [
    { id: 'theme-default', name: 'Azul', primaryColor: '#2196F3' },
    { id: 'theme-brand', name: 'Brand', primaryColor: '#2196F3' },
    { id: 'theme-teal', name: 'Teal', primaryColor: '#009688' },
    { id: 'theme-rose', name: 'Rosa', primaryColor: '#E91E63' },
    { id: 'theme-purple', name: 'Púrpura', primaryColor: '#9C27B0' },
    { id: 'theme-amber', name: 'Ámbar', primaryColor: '#FF9800' },
    { id: 'theme-red', name: 'Rojo', primaryColor: '#F44336' },
    { id: 'theme-green', name: 'Verde', primaryColor: '#4CAF50' }
  ];

  constructor() {
    this.loadThemeConfig();
  }

  setCurrentUser(userId: string): void {
    this.currentUserId = userId;
    this.loadThemeConfig();
  }

  updateThemeConfig(config: Partial<UserThemeConfig>): void {
    const current = this._themeConfig.value;
    const updated = { ...current, ...config, userId: this.currentUserId };

    this._themeConfig.next(updated);
    this.saveThemeConfig(updated);
    this.applyTheme(updated);
  }

  private loadThemeConfig(): void {
    const storageKey = this.STORAGE_KEY + this.currentUserId;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        const config = JSON.parse(saved);
        this._themeConfig.next(config);
        this.applyTheme(config);
      } catch (error) {
        console.error('Error loading theme config:', error);
        this.loadDefaultConfig();
      }
    } else {
      this.loadDefaultConfig();
    }
  }

  private saveThemeConfig(config: UserThemeConfig): void {
    const storageKey = this.STORAGE_KEY + this.currentUserId;
    localStorage.setItem(storageKey, JSON.stringify(config));
  }

  private loadDefaultConfig(): void {
    const defaultConfig: UserThemeConfig = {
      userId: this.currentUserId,
      theme: 'theme-default',
      scheme: 'light',
      customPrimaryColor: '#2196F3',
      logo: 'assets/logo.jpg',
      companyName: 'Sistema de Contratación'
    };

    this._themeConfig.next(defaultConfig);
    this.applyTheme(defaultConfig);
  }

  private applyTheme(config: UserThemeConfig): void {
    // Obtener el color primario del tema seleccionado
    const selectedTheme = this.availableThemes.find(t => t.id === config.theme);
    const primaryColor = selectedTheme ? selectedTheme.primaryColor : config.customPrimaryColor;

    // Aplicar el tema al body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(config.theme);

    // Aplicar esquema de color
    document.body.className = document.body.className.replace(/light|dark/g, '');
    if (config.scheme !== 'auto') {
      document.body.classList.add(config.scheme);
    }

    // Aplicar colores personalizados
    this.applyCustomColors(primaryColor);
  }

  private applyCustomColors(primaryColor: string): void {
    const root = document.documentElement;

    // Convertir hex a RGB
    const hex = primaryColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Aplicar colores CSS personalizados
    root.style.setProperty('--custom-primary', primaryColor);
    root.style.setProperty('--custom-primary-rgb', `${r}, ${g}, ${b}`);

    // Generar variaciones del color para el sidebar y componentes
    const variations = this.generateColorVariations(primaryColor);
    Object.entries(variations).forEach(([key, value]) => {
      root.style.setProperty(`--custom-${key}`, value);
    });

    // Aplicar al sidebar específicamente
    root.style.setProperty('--sidebar-bg', primaryColor);
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
        // Lighten
        return Math.min(255, Math.round(value + (255 - value) * factor));
      } else {
        // Darken
        return Math.max(0, Math.round(value * (1 + factor)));
      }
    };

    const newR = adjust(r);
    const newG = adjust(g);
    const newB = adjust(b);

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  getCurrentConfig(): UserThemeConfig {
    return this._themeConfig.value;
  }

  resetToDefault(): void {
    this.loadDefaultConfig();
    const storageKey = this.STORAGE_KEY + this.currentUserId;
    localStorage.removeItem(storageKey);
  }
}
