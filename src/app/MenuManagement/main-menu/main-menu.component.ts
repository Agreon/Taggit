import {Component, OnInit, EventEmitter} from '@angular/core';
import {Slot} from "../models/slot";
import {Subject} from "rxjs";

/**
 * TODO: Options-traversing
 */
@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  private projectSelected = new Subject<string>();
  private tagSelected = new Subject<string>();

  private headerSelected = new Subject<string>();

  private slots: Slot[] = [
    new Slot("Projects", this.headerSelected, [
      new Slot("EWA", this.projectSelected),
      new Slot("GDV", this.projectSelected),
      new Slot("Philo", this.projectSelected)
    ]),
    new Slot("Tags", this.headerSelected, [
      new Slot("TODO", this.tagSelected),
      new Slot("Question", this.tagSelected)
    ])
  ];

  constructor() { }

  ngOnInit() {
    this.headerSelected.subscribe((name) => {
      console.log(name, "was clicked!");
      this.setActive(name);
      this.getByName(name).collapsed = !this.getByName(name).collapsed;
    });

    this.projectSelected.subscribe((projectName) => {
      console.log("Selected projectName", projectName);
      this.setActive(projectName);
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
