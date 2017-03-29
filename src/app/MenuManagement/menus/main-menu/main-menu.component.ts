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
import {InputService} from "../../../services/input.service";

/**
 * TODO: Back-Button + create button
 */
@Component({
  selector: 'main-menu',
  templateUrl: 'main-menu.component.html',
  styleUrls: ['main-menu.component.css']
})
export class MainMenuComponent extends MenuTemplateComponent implements OnInit{

  private projectSelected = new Subject<any>();
  private tagSelected = new Subject<any>();
  private createProject = new Subject<any>();
  private renameProject = new Subject<Project>();
  private deleteProject = new Subject<Project>();

  private projects: Project[] = [];
  private currentProject: Project;

  constructor(private projectService: ProjectService,
              private modalService: ModalService,
              private inputService: InputService) {
    super();

    this.slots = [
      new Slot("Projects", "book", [
        new Slot("Create Project", "plus", null, null, this.createProject)
      ], false, new Subject<any>(), new Subject<any>(), true, false),
      new Slot("Tags", "tags", [
        new Slot("TODO", "tag", null, false, this.tagSelected),
        new Slot("Question", "tag", null, false, this.tagSelected)
      ])
    ];


    // Load Project-Document
    this.projectService.getProjects().subscribe(projects => {

      this.projects = projects;

      this.slots[0].subSlots = [];

      // Create Project
      this.slots[0].subSlots.push(new Slot("Create Project", "plus", null, false, this.createProject));

      projects.forEach(p => {
        this.slots[0].subSlots.push(new Slot(p.name, "book", [
          new Slot("Rename", "pencil", null,false, this.renameProject, null, false, true, p),
          new Slot("Delete", "trash", null, false, this.deleteProject, null, false, true, p)
        ], true, this.projectSelected, null, false, true, p));
      });
    });

    this.projectService.loadProjects();
  }

  ngOnInit() {
    // Project onSelected
    this.projectSelected.subscribe((project: Project) => {
      console.log("PROJECT",project);
      this.projectService.setCurrentProject(project);
      this.changeMenu.next(new MenuEvent(MENU_TYPE.PROJECT_VIEW));
    });

    // Create Project
    let onCreate = new EventEmitter<Array<ModalInput>>();
    onCreate.subscribe(inputs => {
      this.projectService.createProject(inputs[0].value)
      this.inputService.setActive("MenuContainer");
    });

    this.createProject.subscribe(() => {
      console.log("CreateProject");
      let param = new ModalParameter("New Project",[
        new ModalInput("Name","")
      ], onCreate);
      this.modalService.openModal(param);
    });


    // Rename Project
    let onRename = new EventEmitter<Array<ModalInput>>();
    onRename.subscribe(inputs => {
      // Set Name of project without reloading menu
      this.slots[0].subSlots.filter(s => {return s.active})[0].name = inputs[0].value;
      // Rename Project in DB TODO: maybe notification with snackbar ('saved')
      this.projectService.renameProject(this.currentProject, inputs[0].value);
    });

    this.renameProject.subscribe((project) => {
      this.currentProject = project;
      LogService.log("Rename project", project);
      let param = new ModalParameter("Rename Project",[
        new ModalInput("Name","")
      ], onRename);
      this.modalService.openModal(param);
    });


    // Delete Project
    let onDelete = new EventEmitter<Array<ModalInput>>();
    onDelete.subscribe(inputs => {
      this.projectService.deleteProject(this.currentProject);
    });

    this.deleteProject.subscribe((project) => {
      this.currentProject = project;
      LogService.log("Delete project");
      let param = new ModalParameter("Delete Project",[
        new ModalInput("Are you sure?","")
      ], onDelete);
      this.modalService.openModal(param);
    });



    this.tagSelected.subscribe((tagName) => {
    });



  }
}
