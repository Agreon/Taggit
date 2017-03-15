import {Component, OnInit, Input, HostListener, Output, EventEmitter} from '@angular/core';
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

  @Output("OnCancel")
  onCancel: EventEmitter<any> = new  EventEmitter<any>();

  private currentSlot: number = 0;

  constructor() { }

  ngOnInit() {

  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    // Up
    if(event.keyCode == 40){
        if(this.currentSlot < this.slots.length - 1){
          this.slots[this.currentSlot].active = false;
          this.currentSlot++;
          this.slots[this.currentSlot].active = true;
        }
    }

    // Down
    if(event.keyCode == 38){
      if(this.currentSlot > 0){
        this.slots[this.currentSlot].active = false;
        this.currentSlot--;
        this.slots[this.currentSlot].active = true;
      }
    }


    // Return
    if(event.keyCode == 13){
      this.slots[this.currentSlot].selected.next(this.slots[this.currentSlot].name);
    }

    // Escape
    if(event.keyCode == 27 || 8){
      this.onCancel.emit();
    }
  }

}
