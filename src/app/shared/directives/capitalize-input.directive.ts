import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCapitalizeInput]',
  standalone: true
})
export class CapitalizeInputDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const input = event.target;
    const value = input.value;
    
    if (value) {
      // Capitalizar la primera letra de cada palabra
      const capitalizedValue = value
        .toLowerCase()
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      input.value = capitalizedValue;
      
      // Disparar el evento input para que Angular detecte el cambio
      input.dispatchEvent(new Event('input'));
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: any): void {
    const input = event.target;
    const value = input.value.trim();
    
    if (value) {
      const capitalizedValue = value
        .toLowerCase()
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      input.value = capitalizedValue;
      input.dispatchEvent(new Event('input'));
    }
  }
}
