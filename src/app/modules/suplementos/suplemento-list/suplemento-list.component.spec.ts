import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuplementoListComponent } from './suplemento-list.component';

describe('SuplementoListComponent', () => {
  let component: SuplementoListComponent;
  let fixture: ComponentFixture<SuplementoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuplementoListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuplementoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
