import {Component, OnInit, EventEmitter} from '@angular/core';
import {Slot} from "../models/slot";
import {Subject} from "rxjs";

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  private projectsSelected = new Subject<string>();
  private projectSelected = new Subject<string>();
  private tagsSelected = new Subject<string>();
  private tagSelected = new Subject<string>();

  private slots: Slot[] = [
    new Slot("Projects", this.projectsSelected, [
      new Slot("EWA", this.projectSelected),
      new Slot("GDV", this.projectSelected),
      new Slot("Philo", this.projectSelected)
    ]),
    new Slot("Tags", this.tagsSelected, [
      new Slot("TODO", this.tagSelected),
      new Slot("Question", this.tagSelected)
    ])
  ];

  constructor() { }

  ngOnInit() {
    this.projectsSelected.subscribe(() => {
      console.log("Projects was clicked!");
      this.setActive("Projects");
      this.getByName("Projects").collapsed = !this.getByName("Projects").collapsed;
    });

    this.projectSelected.subscribe((projectName) => {
      console.log("Selected projectName", projectName);
      this.setActive(projectName);
    });

    this.tagsSelected.subscribe(()=> {
      console.log("Tagsselected");
      this.setActive("Tags");
      this.getByName("Tags").collapsed = !this.getByName("Tags").collapsed;
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
