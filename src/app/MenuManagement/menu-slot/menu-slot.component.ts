import {Component, OnInit, Input, EventEmitter} from '@angular/core';
import {Slot} from "../models/slot";


@Component({
  selector: 'menu-slot',
  templateUrl: './menu-slot.component.html',
  styleUrls: ['./menu-slot.component.css']
})
export class MenuSlotComponent implements OnInit {

  @Input("Slot")
  slot: Slot;

  constructor() { }

  ngOnInit() {

  }

  // TODO: Maybe give whole slot
  private selected(event): void {
    this.slot.selected.next(this.slot.name);
  }

}
