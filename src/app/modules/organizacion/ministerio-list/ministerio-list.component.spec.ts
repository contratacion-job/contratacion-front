import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinisterioListComponent } from './ministerio-list.component';

describe('MinisterioListComponent', () => {
  let component: MinisterioListComponent;
  let fixture: ComponentFixture<MinisterioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinisterioListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MinisterioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
