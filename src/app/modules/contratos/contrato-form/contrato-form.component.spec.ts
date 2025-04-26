import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratoFormComponent } from './contrato-form.component';

describe('ContratoFormComponent', () => {
  let component: ContratoFormComponent;
  let fixture: ComponentFixture<ContratoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContratoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContratoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
