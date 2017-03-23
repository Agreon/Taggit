import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {Slot} from "../../models/slot";
import {Subject} from "rxjs";
import {MenuEvent, MENU_TYPE} from "../../menu-manager/menu-manager.component";
import {MenuTemplateComponent} from "../menu-template/menu-template.component";
import {ProjectService} from "../../../services/project.service";
import {Project} from "../../../models/project";
import {ModalService} from "../../../services/modal.service";
import {ModalInput, ModalParameter} from "../../modal/modal.component";

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
  private createProject = new Subject<string>();

  private projects: Project[] = [];

  constructor(private projectService: ProjectService,
              private modalService: ModalService) {
    super();

    this.slots = [
      new Slot("Projects", this.headerSelected, "book", [
        new Slot("Create Menu", this.createProject, "plus")
      ], true, false),
      new Slot("Tags", this.headerSelected, "tags",[
        new Slot("TODO", this.tagSelected, "tag"),
        new Slot("Question", this.tagSelected, "tag")
      ])
    ];


    // Load Project-Document
    this.projectService.getProjects().subscribe(projects => {

      this.projects = projects;

      this.slots[0].options = [];

      // Create Menu
      this.slots[0].options.push(new Slot("Create Menu", this.createProject, "plus"));

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

    // Project selected
    this.projectSelected
      .map(name => {  // Get Project for name
      return  this.projects.filter(p => {
        return p.name == name;
      })[0];
    }).subscribe((project: Project) => {
      this.projectService.setCurrentProject(project);
      this.changeMenu.next(new MenuEvent(MENU_TYPE.PROJECT_VIEW));
    });

    let onCreate = new EventEmitter<Array<ModalInput>>();

    // Create Project
    this.createProject.subscribe(() => {
      console.log("CreateProject");
      let param = new ModalParameter("New Project",[
        new ModalInput("Name","")
      ], onCreate);
      this.modalService.openModal(param);
    });

    onCreate.subscribe(inputs => {
        this.projectService.createProject(inputs[0].value);
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
