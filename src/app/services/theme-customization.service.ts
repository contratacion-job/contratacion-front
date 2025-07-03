import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ColorOption {
  name: string;
  value: string;
  preview: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeCustomizationService {
  private readonly STORAGE_KEY = 'sidebar-color-customization';
  private defaultSidebarColor = '#9370db';

  private _currentSidebarColor = new BehaviorSubject<string>(this.defaultSidebarColor);
  public currentSidebarColor$ = this._currentSidebarColor.asObservable();

  public sidebarColorOptions: ColorOption[] = [
    { name: 'Púrpura Medio', value: '#9370db', preview: 'bg-purple-500' },
    { name: 'Azul Marino', value: '#1e3a8a', preview: 'bg-blue-900' },
    { name: 'Verde Esmeralda', value: '#059669', preview: 'bg-emerald-600' },
    { name: 'Rojo Carmesí', value: '#dc2626', preview: 'bg-red-600' },
    { name: 'Naranja Vibrante', value: '#ea580c', preview: 'bg-orange-600' }
  ];

  constructor() {
    this.loadSavedColor();
    if (typeof document !== 'undefined') {
      this.applySidebarColor(this._currentSidebarColor.value);
    }
  }

  getCurrentSidebarColor(): string {
    return this._currentSidebarColor.value;
  }

  updateSidebarColor(color: string): void {
    console.log('Cambiando color del sidebar a:', color);
    this._currentSidebarColor.next(color);
    this.saveColor(color);
    this.applySidebarColor(color);
  }

  resetToDefault(): void {
    this._currentSidebarColor.next(this.defaultSidebarColor);
    this.saveColor(this.defaultSidebarColor);
    this.applySidebarColor(this.defaultSidebarColor);
  }

  private applySidebarColor(color: string): void {
    if (typeof document === 'undefined') return;

    console.log('Aplicando color:', color);

    const existingStyle = document.getElementById('dynamic-sidebar-style');
    if (existingStyle) {
      existingStyle.remove();
    }

    const styleElement = document.createElement('style');
    styleElement.id = 'dynamic-sidebar-style';
    styleElement.type = 'text/css';

    const hoverColor = this.darkenColor(color, 15);
    const activeColor = this.darkenColor(color, 25);

    const cssRules = `
      .fuse-vertical-navigation-wrapper .fuse-vertical-navigation-content {
        background-color: ${color} !important;
      }

      .fuse-vertical-navigation-wrapper .fuse-vertical-navigation-content .fuse-vertical-navigation-item:hover {
        background-color: ${hoverColor} !important;
      }

      .fuse-vertical-navigation-wrapper .fuse-vertical-navigation-content .fuse-vertical-navigation-item.fuse-vertical-navigation-item-active {
        background-color: ${activeColor} !important;
      }

      fuse-vertical-navigation .fuse-vertical-navigation-content {
        background-color: ${color} !important;
      }
    `;

    styleElement.textContent = cssRules;
    document.head.appendChild(styleElement);
  }

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

  private saveColor(color: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, color);
    }
  }

  private loadSavedColor(): void {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this._currentSidebarColor.next(saved);
      }
    }
  }
}
