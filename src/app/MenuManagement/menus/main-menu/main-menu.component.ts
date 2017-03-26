import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {Slot} from "../../models/slot";
import {Subject} from "rxjs";
import {MenuEvent, MENU_TYPE} from "../../menu-manager/menu-manager.component";
import {MenuTemplateComponent} from "../menu-template/menu-template.component";
import {ProjectService} from "../../../services/project.service";
import {Project} from "../../../models/project";
import {ModalService} from "../../../services/modal.service";
import {ModalInput, ModalParameter} from "../../modal/modal.component";
import {LogService} from "../../../services/log.service";

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

  private renameProject = new Subject<string>();
  private deleteProject = new Subject<string>();

  private projects: Project[] = [];

  constructor(private projectService: ProjectService,
              private modalService: ModalService) {
    super();

    this.slots = [
      new Slot("Projects", "book", [
        new Slot("Create Project", "plus", null, null, this.createProject)
      ], false, new Subject<string>(), new Subject<string>(), true, false),
      new Slot("Tags", "tags", [
        new Slot("TODO", "tag", null, false, this.tagSelected),
        new Slot("Question", "tag", null, false, this.tagSelected)
      ])
    ];


    // Load Project-Document
    this.projectService.getProjects().subscribe(projects => {

      this.projects = projects;

      this.slots[0].subSlots = [];

      // Create Menu
      this.slots[0].subSlots.push(new Slot("Create Menu", "plus", null, false, this.createProject));

      projects.forEach(p => {
        this.slots[0].subSlots.push(new Slot(p.name, "book", [
          new Slot("Rename", "pencil", null,false, this.renameProject),
          new Slot("Delete", "trash", null, false, this.deleteProject)
        ], true, this.projectSelected));
      });
    });

    this.projectService.loadProjects();
  }

  ngOnInit() {
    // Project onSelected
    this.projectSelected
      .map(name => {  // Get Project for name
      return  this.projects.filter(p => {
        return p.name == name;
      })[0];
    }).subscribe((project: Project) => {
      this.projectService.setCurrentProject(project);
      this.changeMenu.next(new MenuEvent(MENU_TYPE.PROJECT_VIEW));
    });

    // Create Project
    let onCreate = new EventEmitter<Array<ModalInput>>();

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

    // Rename Project
    let onRename = new EventEmitter<string>();

    this.renameProject.subscribe(() => {
      LogService.log("Rename project");
      let param = new ModalParameter("New Name",[
        new ModalInput("Name","")
      ], onRename);
      this.modalService.openModal(param);
    });

    onRename.subscribe(inputs => {
      // TODO: Send at least id of project
      //this.projectService.renameProject(inputs[0].value);
    });


    // Delete Project
    let onDelete = new EventEmitter<string>();

    this.deleteProject.subscribe(() => {
      LogService.log("Rename project");
      let param = new ModalParameter("New Name",[
        new ModalInput("Name","")
      ], onDelete);
      this.modalService.openModal(param);
    });

    onDelete.subscribe(inputs => {
      // TODO: Send at least id of project
      //this.projectService.deleteProject(inputs[0].value);
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
