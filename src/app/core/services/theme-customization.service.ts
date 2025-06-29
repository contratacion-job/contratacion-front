import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ThemeCustomization {
  primaryColor: string;
  logo: string;
  companyName: string;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeCustomizationService {
  private readonly STORAGE_PREFIX = 'theme-customization-user-';
  private currentUserId: string = '';

  private _customization = new BehaviorSubject<ThemeCustomization>({
    primaryColor: '#2196F3',
    logo: 'assets/logo.jpg',
    companyName: 'Sistema de Contratación'
  });

  public customization$ = this._customization.asObservable();

  // Colores predefinidos
  public readonly predefinedColors = [
    { id: 'blue', name: 'Azul', color: '#2196F3' },
    { id: 'green', name: 'Verde', color: '#4CAF50' },
    { id: 'orange', name: 'Naranja', color: '#FF9800' },
    { id: 'purple', name: 'Púrpura', color: '#9C27B0' },
    { id: 'red', name: 'Rojo', color: '#F44336' },
    { id: 'teal', name: 'Teal', color: '#009688' },
    { id: 'indigo', name: 'Índigo', color: '#3F51B5' },
    { id: 'pink', name: 'Rosa', color: '#E91E63' }
  ];

  // Logos predefinidos
  public readonly predefinedLogos = [
    { id: 'default', name: 'Logo por defecto', path: 'assets/logo.jpg' },
    { id: 'empresa1', name: 'Empresa Construcción', path: 'assets/logos/construccion.png' },
    { id: 'empresa2', name: 'Empresa Servicios', path: 'assets/logos/servicios.png' },
    { id: 'empresa3', name: 'Empresa Tecnología', path: 'assets/logos/tecnologia.png' },
    { id: 'empresa4', name: 'Empresa Salud', path: 'assets/logos/salud.png' }
  ];

  constructor() {
    this.loadDefaultCustomization();
  }

  setCurrentUser(userId: string): void {
    this.currentUserId = userId;
    this.loadCustomizationForUser(userId);
  }

  setCustomization(customization: Partial<ThemeCustomization>): void {
    const current = this._customization.value;
    const updated = { ...current, ...customization, userId: this.currentUserId };

    this._customization.next(updated);
    this.saveCustomizationForUser(this.currentUserId, updated);
    this.applyThemeColors(updated.primaryColor);
  }

  private loadCustomizationForUser(userId: string): void {
    const storageKey = this.STORAGE_PREFIX + userId;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        const customization = JSON.parse(saved);
        this._customization.next(customization);
        this.applyThemeColors(customization.primaryColor);
      } catch (error) {
        console.error('Error loading user customization:', error);
        this.loadDefaultCustomization();
      }
    } else {
      this.loadDefaultCustomization();
    }
  }

  private saveCustomizationForUser(userId: string, customization: ThemeCustomization): void {
    if (!userId) return;

    const storageKey = this.STORAGE_PREFIX + userId;
    localStorage.setItem(storageKey, JSON.stringify(customization));
  }

  private loadDefaultCustomization(): void {
    const defaultCustomization: ThemeCustomization = {
      primaryColor: '#2196F3',
      logo: 'assets/logo.jpg',
      companyName: 'Sistema de Contratación'
    };

    this._customization.next(defaultCustomization);
    this.applyThemeColors(defaultCustomization.primaryColor);
  }

  private applyThemeColors(primaryColor: string): void {
    const root = document.documentElement;

    // Convertir hex a RGB
    const hex = primaryColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Aplicar colores CSS personalizados
    root.style.setProperty('--custom-primary', primaryColor);
    root.style.setProperty('--custom-primary-rgb', `${r}, ${g}, ${b}`);

    // Generar variaciones del color
    root.style.setProperty('--custom-primary-50', this.lightenColor(primaryColor, 0.9));
    root.style.setProperty('--custom-primary-100', this.lightenColor(primaryColor, 0.8));
    root.style.setProperty('--custom-primary-200', this.lightenColor(primaryColor, 0.6));
    root.style.setProperty('--custom-primary-300', this.lightenColor(primaryColor, 0.4));
    root.style.setProperty('--custom-primary-400', this.lightenColor(primaryColor, 0.2));
    root.style.setProperty('--custom-primary-500', primaryColor);
    root.style.setProperty('--custom-primary-600', this.darkenColor(primaryColor, 0.1));
    root.style.setProperty('--custom-primary-700', this.darkenColor(primaryColor, 0.2));
    root.style.setProperty('--custom-primary-800', this.darkenColor(primaryColor, 0.3));
    root.style.setProperty('--custom-primary-900', this.darkenColor(primaryColor, 0.4));

    // Actualizar colores de Material Design
    this.updateMaterialTheme(primaryColor);
  }

  private updateMaterialTheme(primaryColor: string): void {
    const root = document.documentElement;

    // Actualizar variables CSS de Material Design
    root.style.setProperty('--mat-primary-50', this.lightenColor(primaryColor, 0.9));
    root.style.setProperty('--mat-primary-100', this.lightenColor(primaryColor, 0.8));
    root.style.setProperty('--mat-primary-200', this.lightenColor(primaryColor, 0.6));
    root.style.setProperty('--mat-primary-300', this.lightenColor(primaryColor, 0.4));
    root.style.setProperty('--mat-primary-400', this.lightenColor(primaryColor, 0.2));
    root.style.setProperty('--mat-primary-500', primaryColor);
    root.style.setProperty('--mat-primary-600', this.darkenColor(primaryColor, 0.1));
    root.style.setProperty('--mat-primary-700', this.darkenColor(primaryColor, 0.2));
    root.style.setProperty('--mat-primary-800', this.darkenColor(primaryColor, 0.3));
    root.style.setProperty('--mat-primary-900', this.darkenColor(primaryColor, 0.4));
  }

  private lightenColor(color: string, factor: number): string {
    const hex = color.replace('#', '');
    const r = Math.min(255, Math.round(parseInt(hex.substr(0, 2), 16) + (255 - parseInt(hex.substr(0, 2), 16)) * factor));
    const g = Math.min(255, Math.round(parseInt(hex.substr(2, 2), 16) + (255 - parseInt(hex.substr(2, 2), 16)) * factor));
    const b = Math.min(255, Math.round(parseInt(hex.substr(4, 2), 16) + (255 - parseInt(hex.substr(4, 2), 16)) * factor));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  private darkenColor(color: string, factor: number): string {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.round(parseInt(hex.substr(0, 2), 16) * (1 - factor)));
    const g = Math.max(0, Math.round(parseInt(hex.substr(2, 2), 16) * (1 - factor)));
    const b = Math.max(0, Math.round(parseInt(hex.substr(4, 2), 16) * (1 - factor)));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  getCurrentCustomization(): ThemeCustomization {
    return this._customization.value;
  }

  resetToDefault(): void {
    this.loadDefaultCustomization();
    if (this.currentUserId) {
      localStorage.removeItem(this.STORAGE_PREFIX + this.currentUserId);
    }
  }
}
