import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NotificacionesService } from '../notificaciones.service';
import { ConfigService } from '../config.service';
import { TrabajadoresService } from 'app/modules/organizacion/trabajadores/trabajadores.service';
import { EmailConfig, Trabajador } from 'app/models/Type';


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
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './centro-mensajes.component.html',
  styleUrl: './centro-mensajes.component.scss'
})
export class CentroMensajesComponent implements OnInit {
  recipients: Trabajador[] = [];
  subject: string = '';
  message: string = '';
  newRecipientEmail: string = '';
  showSettings: boolean = false;
  availableTrabajadores: Trabajador[] = [];

  emailSettings: EmailSettings = {
    smtpServer: '',
    port: 587,
    delay: 1000,
    useSsl: true,
    username: '',
    password: ''
  };

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

  constructor(
    private notificacionesService: NotificacionesService,
    private configService: ConfigService,
    private trabajadoresService: TrabajadoresService
  ) { }

  ngOnInit(): void {
    this.loadEmailConfig();
    this.loadTrabajadores();
    this.notificacionesService.getNotificacion().subscribe({
      next: (data) => console.log('Notificaciones:', data),
      error: (error) => console.error('Error fetching notificaciones:', error)
    });
  }

  private loadEmailConfig(): void {
    this.configService.getEmailConfig().subscribe({
      next: (config: EmailConfig) => {
        this.emailSettings = {
          smtpServer: config.servidor_smtp,
          port: config.puerto,
          delay: 1000, // Default value as it's not in EmailConfig
          useSsl: config.usar_ssl || true,
          username: config.usuario,
          password: config.contrasena
        };
        this.updateStats();
      },
      error: (error) => console.error('Error loading email config:', error)
    });
  }

  private loadTrabajadores(): void {
    this.trabajadoresService.getTrabajadores().subscribe({
      next: (trabajadores) => {
        this.availableTrabajadores = trabajadores;
        this.updateStats();
      },
      error: (error) => console.error('Error loading trabajadores:', error)
    });
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
    const selectedTrabajador = this.availableTrabajadores.find(t => t.email === this.newRecipientEmail);
    if (selectedTrabajador && !this.recipients.find(r => r.id === selectedTrabajador.id)) {
      this.recipients.push(selectedTrabajador);
      this.newRecipientEmail = '';
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
    const emailConfig: EmailConfig = {
      servidor_smtp: this.emailSettings.smtpServer,
      puerto: this.emailSettings.port,
      usuario: this.emailSettings.username,
      contrasena: this.emailSettings.password,
      remitente: this.emailSettings.username,
      nombre_remitente: this.emailSettings.username.split('@')[0],
      usar_ssl: this.emailSettings.useSsl
    };

    this.configService.updateEmailConfig(emailConfig).subscribe({
      next: () => {
        console.log('Configuraciones guardadas');
        this.showSettings = false;
      },
      error: (error) => console.error('Error saving email config:', error)
    });
  }

  sendEmails(): void {
    const emailData = {
      recipients: this.recipients,
      subject: this.subject,
      message: this.message,
      settings: this.emailSettings
    };
    
  
  }

  testEmailSettings(): void {
    this.configService.testEmailConfig({ email_destino: this.emailSettings.username }).subscribe({
      next: () => console.log('Email de prueba enviado'),
      error: (error) => console.error('Error testing email:', error)
    });
  }

  saveDraft(): void {
    console.log('Borrador guardado');
  }

  previewEmail(): void {
    console.log('Vista previa del correo');
  }

  importFromCsv(): void {
    console.log('Importar desde CSV');
  }



  useTemplate(template: any): void {
    this.subject = `${template.name} - ` + this.subject;
    this.message = template.preview;
  }
}