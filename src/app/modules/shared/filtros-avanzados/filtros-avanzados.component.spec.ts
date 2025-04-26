import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosAvanzadosComponent } from './filtros-avanzados.component';

describe('FiltrosAvanzadosComponent', () => {
  let component: FiltrosAvanzadosComponent;
  let fixture: ComponentFixture<FiltrosAvanzadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosAvanzadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiltrosAvanzadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
