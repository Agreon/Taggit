import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnSettingsComponent } from './learn-settings.component';

describe('LearnSettingsComponent', () => {
  let component: LearnSettingsComponent;
  let fixture: ComponentFixture<LearnSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
