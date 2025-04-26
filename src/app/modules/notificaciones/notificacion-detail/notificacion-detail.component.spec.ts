import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionDetailComponent } from './notificacion-detail.component';

describe('NotificacionDetailComponent', () => {
  let component: NotificacionDetailComponent;
  let fixture: ComponentFixture<NotificacionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacionDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificacionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
