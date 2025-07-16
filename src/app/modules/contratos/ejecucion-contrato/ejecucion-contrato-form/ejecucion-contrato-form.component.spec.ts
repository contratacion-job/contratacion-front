import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjecucionContratoFormComponent } from './ejecucion-contrato-form.component';

describe('EjecucionContratoFormComponent', () => {
  let component: EjecucionContratoFormComponent;
  let fixture: ComponentFixture<EjecucionContratoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjecucionContratoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EjecucionContratoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
