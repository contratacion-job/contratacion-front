import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinciaListComponent } from './provincia-list.component';

describe('ProvinciaListComponent', () => {
  let component: ProvinciaListComponent;
  let fixture: ComponentFixture<ProvinciaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvinciaListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProvinciaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
