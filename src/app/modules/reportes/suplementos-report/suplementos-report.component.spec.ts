import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuplementosReportComponent } from './suplementos-report.component';

describe('SuplementosReportComponent', () => {
  let component: SuplementosReportComponent;
  let fixture: ComponentFixture<SuplementosReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuplementosReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuplementosReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
