import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Contrato } from 'app/models/Type';
import { mockContrato, expiredContracts,mockDepartamento } from 'app/mock-api/contrato-fake/fake';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {
  private contratos: Contrato[] = mockContrato;
  private expired: Contrato[] = expiredContracts;

  constructor() {}

  getContratos(): Observable<Contrato[]> {
    return of([...this.contratos]);
  }

  getExpiredContratos(): Observable<Contrato[]> {
    return of([...this.expired]);
  }

  createContrato(contrato: Contrato): Observable<Contrato> {
    const newContrato: Contrato = {
      ...contrato,
      id: this.contratos.length + this.expired.length + 1,
      departamento: contrato.departamento || mockDepartamento[0],
      estado: contrato.estado || 'Activo'
    };
    this.contratos.push(newContrato);
    return of(newContrato);
  }

  updateContrato(id: number, contrato: Contrato): Observable<Contrato> {
    const index = this.contratos.findIndex(c => c.id === id);
    if (index !== -1) {
      this.contratos[index] = { ...contrato, id };
      return of(this.contratos[index]);
    }
    const expiredIndex = this.expired.findIndex(c => c.id === id);
    if (expiredIndex !== -1) {
      this.expired[expiredIndex] = { ...contrato, id };
      return of(this.expired[expiredIndex]);
    }
    throw new Error('Contrato not found');
  }

  deleteContrato(id: number): Observable<void> {
    const index = this.contratos.findIndex(c => c.id === id);
    if (index !== -1) {
      this.contratos.splice(index, 1);
      return of(void 0);
    }
    const expiredIndex = this.expired.findIndex(c => c.id === id);
    if (expiredIndex !== -1) {
      this.expired.splice(expiredIndex, 1);
      return of(void 0);
    }
    throw new Error('Contrato not found');
  }

  transferExpiredContratos(): Observable<Contrato[]> {
    const expired = this.contratos.filter(c => c.estado === 'Vencido');
    if (expired.length > 0) {
      this.expired.push(...expired);
      this.contratos = this.contratos.filter(c => c.estado !== 'Vencido');
    }
    return of(expired);
  }

  restoreContrato(id: number): Observable<Contrato> {
    const index = this.expired.findIndex(c => c.id === id);
    if (index !== -1) {
      const restored = { ...this.expired[index], estado: 'Activo' };
      this.contratos.push(restored);
      this.expired.splice(index, 1);
      return of(restored);
    }
    throw new Error('Expired contrato not found');
  }
}