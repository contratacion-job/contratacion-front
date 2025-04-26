import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuplementoFormComponent } from './suplemento-form.component';

describe('SuplementoFormComponent', () => {
  let component: SuplementoFormComponent;
  let fixture: ComponentFixture<SuplementoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuplementoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuplementoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
