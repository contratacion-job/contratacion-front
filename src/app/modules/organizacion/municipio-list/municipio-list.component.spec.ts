import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunicipioListComponent } from './municipio-list.component';

describe('MunicipioListComponent', () => {
  let component: MunicipioListComponent;
  let fixture: ComponentFixture<MunicipioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MunicipioListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MunicipioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
