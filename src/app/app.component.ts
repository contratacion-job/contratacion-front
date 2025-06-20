import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss'],
    standalone : true,
    imports    : [RouterOutlet],
})
export class AppComponent implements OnInit {
    private translocoService = inject(TranslocoService);

    constructor() {}

    ngOnInit(): void {
        // Cargar traducciones después del bootstrap
        const defaultLang = this.translocoService.getDefaultLang();
        this.translocoService.setActiveLang(defaultLang);
        
        this.translocoService.load(defaultLang).subscribe({
            next: () => console.log('Translations loaded'),
            error: (error) => console.warn('Translation loading failed:', error)
        });
    }
}
