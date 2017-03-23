import {Component, OnInit, Input, EventEmitter, SimpleChanges} from '@angular/core';
import {Slot} from "../models/slot";


@Component({
  selector: 'menu-slot',
  templateUrl: './menu-slot.component.html',
  styleUrls: ['./menu-slot.component.css']
})
export class MenuSlotComponent implements OnInit {

  @Input("Slot")
  slot: Slot;

  private iconStyle = "fa fa-book";

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["slot"]){
      this.iconStyle = "fa fa-" + this.slot.icon;
    }
  }

  ngOnInit(): void {
  }

  // TODO: Maybe give back whole slot
  private selected(event): void {
    event.stopPropagation();
    this.slot.selected.next(this.slot.name);
  }

}
