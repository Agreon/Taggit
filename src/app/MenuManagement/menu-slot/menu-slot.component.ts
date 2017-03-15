import {Component, OnInit, Input, EventEmitter} from '@angular/core';
import {Slot} from "../models/slot";
/**
 * TODO:
 * + Add Options
 * + Add Styling
 */
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

  private selected(event): void{
    this.slot.event.emit(event);
  }

}
