import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-report-header',
  templateUrl: './report-header.component.html',
  styleUrls: ['./report-header.component.scss']
})
export class ReportHeaderComponent {
  @Input() title: string = 'Sistema Contratacion';
  @Input() logoUrl: string = 'assets/images/logo/logo.jpg'; // Ajustar ruta según corresponda
}
