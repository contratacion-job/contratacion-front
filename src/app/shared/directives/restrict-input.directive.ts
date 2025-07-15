import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appRestrictInput]',
  standalone: true
})
export class RestrictInputDirective {
  @Input() appRestrictInput: string = '';
  @Input() maxLength: number = 0;

  constructor(private el: ElementRef) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): boolean {
    if (!this.appRestrictInput) {
      return true;
    }

    // Verificar longitud máxima
    if (this.maxLength > 0 && this.el.nativeElement.value.length >= this.maxLength) {
      event.preventDefault();
      return false;
    }

    const pattern = new RegExp(this.appRestrictInput);
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const paste = event.clipboardData?.getData('text') || '';
    const pattern = new RegExp(`^${this.appRestrictInput}+$`);
    
    if (pattern.test(paste)) {
      let newValue = this.el.nativeElement.value + paste;
      
      // Aplicar longitud máxima si está definida
      if (this.maxLength > 0 && newValue.length > this.maxLength) {
        newValue = newValue.substring(0, this.maxLength);
      }
      
      this.el.nativeElement.value = newValue;
      this.el.nativeElement.dispatchEvent(new Event('input'));
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    if (this.maxLength > 0 && event.target.value.length > this.maxLength) {
      event.target.value = event.target.value.substring(0, this.maxLength);
    }
  }
}
