import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratosReportComponent } from './contratos-report.component';

describe('ContratosReportComponent', () => {
  let component: ContratosReportComponent;
  let fixture: ComponentFixture<ContratosReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContratosReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContratosReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
