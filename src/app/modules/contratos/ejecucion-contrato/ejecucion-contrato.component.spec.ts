import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjecucionContratoComponent } from './ejecucion-contrato.component';

describe('EjecucionContratoComponent', () => {
  let component: EjecucionContratoComponent;
  let fixture: ComponentFixture<EjecucionContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjecucionContratoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EjecucionContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
