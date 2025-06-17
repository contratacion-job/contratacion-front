import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoContratoFormComponent } from './tipo-contrato-form.component';

describe('TipoContratoFormComponent', () => {
  let component: TipoContratoFormComponent;
  let fixture: ComponentFixture<TipoContratoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoContratoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TipoContratoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
