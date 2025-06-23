import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjecucionSuplementoFormComponent } from './ejecucion-suplemento-form.component';

describe('EjecucionSuplementoFormComponent', () => {
  let component: EjecucionSuplementoFormComponent;
  let fixture: ComponentFixture<EjecucionSuplementoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjecucionSuplementoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EjecucionSuplementoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
