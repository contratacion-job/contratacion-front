import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuplementoDetailComponent } from './suplemento-detail.component';

describe('SuplementoDetailComponent', () => {
  let component: SuplementoDetailComponent;
  let fixture: ComponentFixture<SuplementoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuplementoDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuplementoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
