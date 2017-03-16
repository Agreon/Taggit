import { Component, OnInit } from '@angular/core';
import {MenuTemplateComponent} from "../menu-template/menu-template.component";
import {MENU_TYPE, MenuEvent} from "../../menu-manager/menu-manager.component";

@Component({
  selector: 'project-view-menu',
  templateUrl: './project-view-menu.component.html',
  styleUrls: ['./project-view-menu.component.css']
})
export class ProjectViewMenuComponent extends MenuTemplateComponent{

  constructor() {
    super();
  }

  ngOnInit() {
    console.log("Created",this.param);
    this.slots = [];
  }

  private cancel(): void {
    this.changeMenu.next(new MenuEvent(MENU_TYPE.MAIN_MENU, {}));
  }

}

