import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from 'app/core/constants/api-endpoints';
import { BackupConfig, EmailConfig, EmailTest, SystemConfig } from 'app/models/Type';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor(private http: HttpClient) {}

  // System Configuration
  getSystemConfig(): Observable<SystemConfig> {
    return this.http.get<SystemConfig>(API_ENDPOINTS.CONFIGURACION.BASE);
  }

  updateSystemConfig(config: SystemConfig): Observable<SystemConfig> {
    return this.http.put<SystemConfig>(API_ENDPOINTS.CONFIGURACION.BASE, config);
  }

  // Email Configuration
  getEmailConfig(): Observable<EmailConfig> {
    return this.http.get<EmailConfig>(API_ENDPOINTS.CONFIGURACION.EMAIL);
  }

  updateEmailConfig(config: EmailConfig): Observable<EmailConfig> {
    return this.http.put<EmailConfig>(API_ENDPOINTS.CONFIGURACION.EMAIL, config);
  }

  testEmailConfig(emailTest: EmailTest): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.CONFIGURACION.EMAIL_TEST, emailTest);
  }

  // Backup Configuration
  getBackupConfig(): Observable<BackupConfig> {
    return this.http.get<BackupConfig>(API_ENDPOINTS.CONFIGURACION.BACKUP);
  }

  updateBackupConfig(config: BackupConfig): Observable<BackupConfig> {
    return this.http.put<BackupConfig>(API_ENDPOINTS.CONFIGURACION.BACKUP, config);
  }
}