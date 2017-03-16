import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectViewMenuComponent } from './project-view-menu.component';

describe('ProjectViewMenuComponent', () => {
  let component: ProjectViewMenuComponent;
  let fixture: ComponentFixture<ProjectViewMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectViewMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectViewMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
