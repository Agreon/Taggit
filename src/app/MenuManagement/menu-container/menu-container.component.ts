import {Component, OnInit, Input} from '@angular/core';
import {Slot} from "../models/slot";

/**
 * TODO:
 * + Styling
 * + Keyevents
 */
@Component({
  selector: 'menu-container',
  templateUrl: './menu-container.component.html',
  styleUrls: ['./menu-container.component.css']
})
export class MenuContainerComponent implements OnInit {

  @Input("Name")
  name: string;

  @Input("Slots")
  slots: Slot[];

  private currentSlot: Slot;

  constructor() { }

  ngOnInit() {

  }

}
