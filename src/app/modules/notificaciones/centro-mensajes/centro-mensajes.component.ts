import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
interface Recipient {
  id: number;
  email: string;
  name: string;
}

interface EmailSettings {
  smtpServer: string;
  port: number;
  delay: number;
  useSsl: boolean;
  username: string;
  password: string;
}
@Component({
  selector: 'app-centro-mensajes',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './centro-mensajes.component.html',
  styleUrl: './centro-mensajes.component.scss'
})
export class CentroMensajesComponent implements OnInit {

  recipients: Recipient[] = [
    { id: 1, email: 'usuario1@example.com', name: 'Juan Pérez' },
    { id: 2, email: 'usuario2@example.com', name: 'María García' }
  ];

  subject: string = '';
  message: string = '';
  newRecipient: string = '';
  showSettings: boolean = false;

  emailSettings: EmailSettings = {
    smtpServer: 'smtp.gmail.com',
    port: 587,
    delay: 1000,
    useSsl: true,
    username: '',
    password: ''
  };

  // Estadísticas y vista previa
  showPreview: boolean = true;
  emailStats = {
    totalEmails: 0,
    sent: 0,
    pending: 0,
    failed: 0
  };

templates = [
  {
    id: 1,
    name: 'Contrato Aprobado',
    preview: 'Estimado/a {nombre}, nos complace informarle que su contrato #{numeroContrato} ha sido aprobado y está listo para su firma...'
  },
  {
    id: 2,
    name: 'Contrato Vencido',
    preview: 'Estimado/a {nombre}, le informamos que su contrato #{numeroContrato} vencerá el {fechaVencimiento}. Por favor, contacte con nosotros para renovar...'
  },
  {
    id: 3,
    name: 'Solicitud Pendiente',
    preview: 'Estimado/a {nombre}, su solicitud de contrato #{numeroSolicitud} está siendo revisada. Le notificaremos el estado en breve...'
  },
  {
    id: 4,
    name: 'Documentos Requeridos',
    preview: 'Estimado/a {nombre}, para procesar su contrato #{numeroContrato} necesitamos que nos proporcione los siguientes documentos: {documentos}...'
  },
  {
    id: 5,
    name: 'Renovación de Contrato',
    preview: 'Estimado/a {nombre}, es momento de renovar su contrato #{numeroContrato}. Hemos preparado una nueva propuesta con condiciones mejoradas...'
  },
  {
    id: 6,
    name: 'Contrato Rechazado',
    preview: 'Estimado/a {nombre}, lamentamos informarle que su solicitud de contrato #{numeroSolicitud} no ha sido aprobada. Motivo: {motivo}...'
  }
];


  constructor() { }

  ngOnInit(): void {
    this.updateStats();
  }

  updateStats(): void {
    this.emailStats = {
      totalEmails: this.recipients.length,
      sent: 0,
      pending: this.recipients.length,
      failed: 0
    };
  }

  addRecipient(): void {
    if (this.newRecipient.trim()) {
      const newId = Math.max(...this.recipients.map(r => r.id), 0) + 1;
      this.recipients.push({
        id: newId,
        email: this.newRecipient,
        name: this.newRecipient.split('@')[0]
      });
      this.newRecipient = '';
      this.updateStats();
    }
  }

  removeRecipient(id: number): void {
    this.recipients = this.recipients.filter(r => r.id !== id);
    this.updateStats();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.addRecipient();
    }
  }

  toggleSettings(): void {
    this.showSettings = !this.showSettings;
  }

  saveSettings(): void {
    // Logic to save settings
    console.log('Configuraciones guardadas:', this.emailSettings);
    this.showSettings = false;
  }

  sendEmails(): void {
    // Logic to send emails
    const emailData = {
      recipients: this.recipients,
      subject: this.subject,
      message: this.message,
      settings: this.emailSettings
    };
    console.log('Enviando correos:', emailData);
    // Here you would integrate with your email service
  }

  saveDraft(): void {
    // Logic to save draft
    console.log('Borrador guardado');
  }

  previewEmail(): void {
    // Logic to preview email
    console.log('Vista previa del correo');
  }

  importFromCsv(): void {
    // Logic to import from CSV
    console.log('Importar desde CSV');
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview;
  }

  useTemplate(template: any): void {
    this.subject = `${template.name} - ` + this.subject;
    this.message = template.preview;
  }
}
