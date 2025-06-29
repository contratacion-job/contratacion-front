import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuplementosExpiredComponent } from './suplementos-expired.component';

describe('SuplementosExpiredComponent', () => {
  let component: SuplementosExpiredComponent;
  let fixture: ComponentFixture<SuplementosExpiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuplementosExpiredComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuplementosExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
