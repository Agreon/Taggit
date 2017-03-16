import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {Slot} from "../../models/slot";
import {Subject} from "rxjs";
import {MenuEvent, MENU_TYPE} from "../../menu-manager/menu-manager.component";
import {MenuTemplateComponent} from "../menu-template/menu-template.component";

/**
 * TODO: Back-Button + create button
 */
@Component({
  selector: 'main-menu',
  templateUrl: 'main-menu.component.html',
  styleUrls: ['main-menu.component.css']
})
export class MainMenuComponent extends MenuTemplateComponent{

  private projectSelected = new Subject<string>();
  private tagSelected = new Subject<string>();

  private headerSelected = new Subject<string>();



  constructor() {
    super();

    this.slots = [
      new Slot("Projects", this.headerSelected, "book", [
        new Slot("EWA", this.projectSelected, "book"),
        new Slot("GDV", this.projectSelected, "book"),
        new Slot("Philo", this.projectSelected, "book")
      ], true, false),
      new Slot("Tags", this.headerSelected, "book",[
        new Slot("TODO", this.tagSelected, "book"),
        new Slot("Question", this.tagSelected, "book")
      ])
    ];

  }

  ngOnInit() {
    this.headerSelected.subscribe((name) => {
      console.log(name, "was clicked!");
      this.setActive(name);
      this.getByName(name).collapsed = !this.getByName(name).collapsed;
    });

    this.projectSelected.subscribe((projectName) => {
      console.log("Selected projectName", projectName);
      // TODO: Menuobjekt übergeben
      this.changeMenu.next(new MenuEvent(MENU_TYPE.PROJECT_VIEW, {'name': projectName}));
    });

    this.tagSelected.subscribe((tagName) => {
      console.log("Selected tag", tagName);
      this.setActive(tagName);
    });
  }

  private getByName(name: string): Slot {
    return this.slots.filter(slot => {
      return slot.name == name;
    })[0];
  }

  private setActive(slotName: string) {
    this.slots.forEach(slot => {
      slot.active = slot.name == slotName;
    });
  }

}
