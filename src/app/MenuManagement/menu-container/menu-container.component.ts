import {Component, OnInit, Input, HostListener, Output, EventEmitter} from '@angular/core';
import {Slot} from "../models/slot";
import {InputReceiver} from "../../models/input-receiver";
import {InputService} from "../../services/input.service";
import {MENU_TYPE} from "../menu-manager/menu-manager.component";

/**
 * TODO:
 * + Keyevents from service
 * + stoppropagination
 */
@Component({
  selector: 'menu-container',
  templateUrl: './menu-container.component.html',
  styleUrls: ['./menu-container.component.css']
})
export class MenuContainerComponent implements OnInit, InputReceiver {

  @Input("Name")
  name: string;

  @Input("Slots")
  slots: Slot[];

  @Input("ShowBackBtn")
  showBackBtn: boolean;

  @Output("OnCancel")
  onCancel: EventEmitter<any> = new  EventEmitter<any>();

  private currentSlot: number = 0;
  private optionIndex: number = -1;

  constructor(private inputService: InputService) {
  }

  ngOnInit() {
    this.inputService.addReciever("MenuContainer", this);
    this.inputService.setActive("MenuContainer");
  }

  ngOnChanges() {

  }

  private hover(slot: Slot){
    this.setActive(slot.name);
  }

  private backPressed(){
    this.onCancel.emit();
  }

  keyEvent(event: KeyboardEvent) {
    event.stopPropagation();

    // Down
    if(event.keyCode == 40){
      if(this.slots[this.currentSlot].collapsed == false){
        if( this.optionIndex < this.slots[this.currentSlot].options.length - 1){
          if(this.optionIndex != -1) {
            this.slots[this.currentSlot]
              .options[this.optionIndex].active = false;
          }
          this.optionIndex++;
          this.slots[this.currentSlot]
            .options[this.optionIndex].active = true;
        }
      }
      else if(this.currentSlot < this.slots.length - 1){
        this.slots[this.currentSlot].active = false;
        this.currentSlot++;
        this.slots[this.currentSlot].active = true;
      }
    }

    // Up
    if(event.keyCode == 38){
      if(this.slots[this.currentSlot].collapsed == false){
        if(this.optionIndex > -1){
          this.slots[this.currentSlot]
            .options[this.optionIndex].active = false;

          this.optionIndex--;
          if(this.optionIndex != -1){
            this.slots[this.currentSlot]
              .options[this.optionIndex].active = true;
          }
        }
      }
      else if(this.currentSlot > 0){
        this.slots[this.currentSlot].active = false;
        this.currentSlot--;
        this.slots[this.currentSlot].active = true;
      }
    }

    // Return
    if(event.keyCode == 13){
      if(this.optionIndex != -1) {
        this.slots[this.currentSlot]
          .options[this.optionIndex]
          .selected.next(this.slots[this.currentSlot]
          .options[this.optionIndex].name);
      }else {
        this.slots[this.currentSlot]
          .selected.next(this.slots[this.currentSlot].name);
        // todo reset optionindex .active
      }
    }

    // Escape
    if(event.keyCode == 27 || event.keyCode == 8){
      if(this.optionIndex != -1){
        this.slots[this.currentSlot]
          .options[this.optionIndex]
          .active = false;
        this.slots[this.currentSlot].collapsed = true;
        this.optionIndex = -1;
      }
      this.onCancel.emit();
    }
  }

  private setActive(slotName: string) {
    this.slots.forEach(slot => {
      slot.active =  slot.name == slotName;
    });
  }
}
