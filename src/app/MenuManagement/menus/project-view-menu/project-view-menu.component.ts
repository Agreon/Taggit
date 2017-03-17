import {Component, OnInit, Input, Output} from '@angular/core';
import {MenuTemplateComponent} from "../menu-template/menu-template.component";
import {MENU_TYPE, MenuEvent} from "../../menu-manager/menu-manager.component";
import {Subject} from "rxjs";
import {Slot} from "../../models/slot";
import {ProjectService} from "../../../services/project.service";
import {Project} from "../../../models/project";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'project-view-menu',
  templateUrl: './project-view-menu.component.html',
  styleUrls: ['./project-view-menu.component.css']
})
export class ProjectViewMenuComponent extends MenuTemplateComponent implements OnInit{

  private selectedDocument = new Subject<string>();

  private project: Project;

  constructor(private projectService: ProjectService,
              private router: Router) {
    super();

    // On Project-Load
    this.projectService.getCurrentProject().subscribe(project => {
      console.log("Got Project", project);

      if(!project){
        return;
      }
      this.project = project;
      this.updateView();
    });

    // On Project-Select
    this.selectedDocument.subscribe(d => {

      this.slots.forEach(slot => {
        slot.active = slot.name == d;
      });

      this.projectService.setCurrentDocument(this.project.getDocument(d));
      this.router.navigate(['/MainEditor']);
    });

  }

  ngOnInit() {
  }

  public updateView(): void {
    this.slots = [];

    if(this.project.documents.length < 1){
      return;
    }

    this.project.documents.forEach(d => {
      this.slots.push(new Slot(d.name,this.selectedDocument,"book"));
    });

    if(this.slots.length < 1){
      return;
    }

    this.slots[0].active = true;
  }

  private cancel(): void {
    this.changeMenu.next(new MenuEvent(MENU_TYPE.MAIN_MENU, {}));
  }

}

