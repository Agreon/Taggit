import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {Slot} from "../../models/slot";
import {Subject} from "rxjs";
import {MenuEvent, MENU_TYPE} from "../../menu-manager/menu-manager.component";
import {MenuTemplateComponent} from "../menu-template/menu-template.component";
import {ProjectService} from "../../../../services/project.service";
import {Project} from "../../../../models/project";
import {ModalService} from "../../../../services/modal.service";
import {ModalInput, ModalParameter} from "../../modal/modal.component";
import {LogService} from "../../../../services/log.service";
import {InputService} from "../../../../services/input.service";
import {UserService} from "../../../../services/user.service";
import {TagService} from "../../../../services/tag.service";
import {Tag} from "../../../../models/tag";
import {MessageType, UserInformationService, UserMessage} from "../../../../services/User-Information.service";
import {LearnService} from "../../../../services/learn.service";


/**
 * Git-Issue[#19]: Add Learning to Projects [feature]
 */
@Component({
  selector: 'main-menu',
  templateUrl: 'main-menu.component.html',
  styleUrls: ['main-menu.component.css']
})
export class MainMenuComponent extends MenuTemplateComponent implements OnInit{

  private projectSelected = new Subject<any>();
  private createProject = new Subject<any>();
  private learnProject = new Subject<Project>();
  private renameProject = new Subject<Project>();
  private deleteProject = new Subject<Project>();

  private tagSelected = new Subject<any>();
  private createTag = new Subject<any>();
  private deleteTag = new Subject<Tag>();

  private currentProject: Project;

  constructor(private projectService: ProjectService,
              private modalService: ModalService,
              private userService: UserService,
              private tagService: TagService,
              private informationService: UserInformationService,
              private learnService: LearnService) {
    super();

    this.slots = [
      new Slot("Projects", "book", [], false, new Subject<any>(), true, false),
      new Slot("Tags", "tags", [])
    ];

    // TODO: Maybe in Init
    let startTime = Date.now();
    this.loading = true;

    // Load Projects
    this.projectService.getProjects().subscribe(projects => {

      this.slots[0].subSlots = [];

      // Create Project
      this.slots[0].subSlots.push(new Slot("Create Project", "plus", null, false, this.createProject, true));

      projects.forEach(p => {
        this.slots[0].subSlots.push(new Slot(p.name, "book", [
        //  new Slot("Learn", "leanpub", null, false, this.learnProject, false, true, p),
          new Slot("Rename", "pencil", null,false, this.renameProject, false, true, p),
          new Slot("Delete", "trash", null, false, this.deleteProject, false, true, p)
        ], true, this.projectSelected, false, true, p));
      });

      this.loading = false;
      LogService.log("Loadingtime", Date.now() - startTime);
    });

    // Load Tags
    this.tagService.getTags().subscribe(tags => {
      this.slots[1].subSlots = [];

      // Create Tag
      this.slots[1].subSlots.push(new Slot("Create Tag", "plus", null, false, this.createTag));

      tags.forEach(p => {
        this.slots[1].subSlots.push(new Slot(p.name, "tag", [
          new Slot("Delete", "trash", null, false, this.deleteTag, false, true, p)
        ], true, this.tagSelected, false, true, p));
      });
    });


    this.userService.getCurrentUser().subscribe(user => {
     /* if(!user){
        this.projectService.setCurrentDocument(null);
        //return;
      }*/
      startTime = Date.now();
      this.loading = true;
      this.projectService.loadProjects();
    });
  }

  ngOnInit() {
    // Select Project
    this.projectSelected.subscribe((project: Project) => {
      LogService.log("PROJECT",project);
      this.projectService.setCurrentProject(project);
      this.changeMenu.next(new MenuEvent(MENU_TYPE.PROJECT_VIEW));
    });

    // Create Project
    let onCreate = new EventEmitter<Array<ModalInput>>();
    onCreate.subscribe(inputs => {
      this.projectService.createProject(inputs[0].value)
    });

    // Open Modal on Selection
    this.createProject.subscribe(() => {
      console.log("CreateProject");
      let param = new ModalParameter("New Project",[
        new ModalInput("Name","")
      ], onCreate, "MenuContainer");
      this.modalService.openModal(param);
    });

    // Learn Project
    this.learnProject.subscribe((project) => {
      this.currentProject= project;
      LogService.log("Learn Project", project);

      // Get all documents if not cached // TODO: Start Loading

    });

    // Rename Project
    let onRename = new EventEmitter<Array<ModalInput>>();
    onRename.subscribe(inputs => {

      // Rename Project in DB
      this.projectService.renameProject(this.currentProject, inputs[0].value).subscribe(() => {

        // Set Name of project without reloading menu
        let currentSlot = this.slots[0].subSlots.filter(s => {
          return s.eventPayload && s.eventPayload._id == this.currentProject._id;
        })[0];

        currentSlot.name = inputs[0].value;
        currentSlot.closeSlot();

        this.informationService.showInformation(new UserMessage(
          MessageType.SUCCESS,
          "Project renamed. "
        ));
      });
    });

    this.renameProject.subscribe((project) => {
      this.currentProject = project;
      LogService.log("Rename project", project);
      let param = new ModalParameter("Rename Project",[
        new ModalInput("Name",this.currentProject.name)
      ], onRename, "MenuContainer");
      this.modalService.openModal(param);
    });


    // Delete Project
    let onDelete = new EventEmitter<Array<ModalInput>>();
    onDelete.subscribe(inputs => {
      this.projectService.deleteProject(this.currentProject).subscribe(() => {

        let subSlots = this.slots[0].subSlots;
        let toDelete = -1;
        for(let i = 0; i < subSlots.length; i++){
          if(subSlots[i].eventPayload && subSlots[i].eventPayload._id == this.currentProject._id){
            toDelete = i;
            break;
          }
        }

        if(toDelete != -1){
          this.slots[0].subSlots.splice(toDelete, 1);
        }

        this.informationService.showInformation(new UserMessage(
          MessageType.SUCCESS,
          "Project "+this.currentProject.name+" deleted"
        ));
      });


    });

    this.deleteProject.subscribe((project) => {
      this.currentProject = project;
      LogService.log("Delete project");
      let param = new ModalParameter("Delete Project",[], onDelete, "MenuContainer", "Are you sure?");
      this.modalService.openModal(param);
    });



    this.tagSelected.subscribe((tag) => {
    });

    this.deleteTag.subscribe((tag) => {

    });



  }
}
