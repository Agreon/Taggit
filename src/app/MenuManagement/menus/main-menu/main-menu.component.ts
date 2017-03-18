import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {Slot} from "../../models/slot";
import {Subject} from "rxjs";
import {MenuEvent, MENU_TYPE} from "../../menu-manager/menu-manager.component";
import {MenuTemplateComponent} from "../menu-template/menu-template.component";
import {ProjectService} from "../../../services/project.service";
import {Project} from "../../../models/project";

/**
 * TODO: Back-Button + create button
 */
@Component({
  selector: 'main-menu',
  templateUrl: 'main-menu.component.html',
  styleUrls: ['main-menu.component.css']
})
export class MainMenuComponent extends MenuTemplateComponent implements OnInit{

  private projectSelected = new Subject<string>();
  private tagSelected = new Subject<string>();
  private headerSelected = new Subject<string>();

  private projects: Project[] = [];

  constructor(private projectService: ProjectService) {
    super();

    this.slots = [
      new Slot("Projects", this.headerSelected, "book", [
      ], true, false),
      new Slot("Tags", this.headerSelected, "book",[
        new Slot("TODO", this.tagSelected, "book"),
        new Slot("Question", this.tagSelected, "book")
      ])
    ];

    // Load Project-Document
    this.projectService.getProjects().subscribe(projects => {
      /**
       * Foreach oder mapping??
       * @type {Project[]}
       */
      this.projects = projects;

      projects.forEach(p => {
        this.slots[0].options.push(new Slot(p.name,this.projectSelected,"book"));
      });
    });

    this.projectService.loadProjects();
  }

  ngOnInit() {
    this.headerSelected.subscribe((name) => {
      this.getByName(name).collapsed = !this.getByName(name).collapsed;
    });

    this.projectSelected
      .map(name => {  // Get Project for name
      return  this.projects.filter(p => {
        return p.name == name;
      })[0];
    }).subscribe(project => {
      this.projectService.setCurrentProject(project);
      this.changeMenu.next(new MenuEvent(MENU_TYPE.PROJECT_VIEW));
    });

    this.tagSelected.subscribe((tagName) => {
    });
  }

  private getByName(name: string): Slot {
    return this.slots.filter(slot => {
      return slot.name == name;
    })[0];
  }

}
