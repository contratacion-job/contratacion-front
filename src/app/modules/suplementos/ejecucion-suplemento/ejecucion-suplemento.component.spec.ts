import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjecucionSuplementoComponent } from './ejecucion-suplemento.component';

describe('EjecucionSuplementoComponent', () => {
  let component: EjecucionSuplementoComponent;
  let fixture: ComponentFixture<EjecucionSuplementoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjecucionSuplementoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EjecucionSuplementoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
