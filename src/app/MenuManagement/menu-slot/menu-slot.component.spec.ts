import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSlotComponent } from './menu-slot.component';

describe('MenuSlotComponent', () => {
  let component: MenuSlotComponent;
  let fixture: ComponentFixture<MenuSlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuSlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
