import { Injectable } from '@angular/core';
import { AppConfigService } from '../../services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeInitService {

  constructor(private _appConfigService: AppConfigService) {}

  /**
   * Initialize theme on app startup
   */
  initializeTheme(): void {
    // El servicio AppConfigService ya maneja la inicialización
    // en su constructor, así que no necesitamos hacer nada aquí
    console.log('Theme initialization service loaded');
  }

  /**
   * Apply theme changes
   */
  applyTheme(primaryColor: string): void {
    this._appConfigService.updatePrimaryColor(primaryColor);
  }

  /**
   * Get current theme configuration
   */
  getCurrentTheme(): any {
    return this._appConfigService.currentCustomization;
  }
}
