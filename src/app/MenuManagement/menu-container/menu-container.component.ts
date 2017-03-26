import {Component, OnInit, Input, HostListener, Output, EventEmitter, SimpleChanges} from '@angular/core';
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
  private subSlotIndex: number = -1;

  constructor(private inputService: InputService) {
  }

  ngOnInit() {
    this.inputService.addReciever("MenuContainer", this);
    this.inputService.setActive("MenuContainer");
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["slots"]){
      for(let slot of this.slots){
        slot.onHover.subscribe((name) => {
          //this.setActive(name);
        });
      }
    }
  }

  private backPressed(){
    this.onCancel.emit();
  }

  /**
   * TODO: Remove if elses and just create one var for current slot
   * TODO: Move alot to the slots
   * @param event
   */
  keyEvent(event: KeyboardEvent) {
    event.stopPropagation();

    // Down
    if(event.keyCode == 40){
      if(this.slots[this.currentSlot].collapsed == false){
        if( this.subSlotIndex < this.slots[this.currentSlot].subSlots.length - 1){
          if(this.subSlotIndex != -1) {
            this.slots[this.currentSlot]
              .subSlots[this.subSlotIndex].active = false;
          }
          this.subSlotIndex++;
          this.slots[this.currentSlot]
            .subSlots[this.subSlotIndex].active = true;
        }
      }
      else if(this.currentSlot < this.slots.length - 1){
        this.currentSlot++;
        this.setActive(this.slots[this.currentSlot].name);
      }
    }

    // Up
    if(event.keyCode == 38){
      if(this.slots[this.currentSlot].collapsed == false){
        if(this.subSlotIndex > -1){
          this.slots[this.currentSlot]
            .subSlots[this.subSlotIndex].active = false;

          this.subSlotIndex--;
          if(this.subSlotIndex != -1){
            this.slots[this.currentSlot]
              .subSlots[this.subSlotIndex].active = true;
          }
        }
      }
      else if(this.currentSlot > 0){
        this.currentSlot--;
        this.setActive(this.slots[this.currentSlot].name);
      }
    }

    // Return
    if(event.keyCode == 13){
      if(this.subSlotIndex != -1) {
        this.slots[this.currentSlot]
          .subSlots[this.subSlotIndex]
          .onSelected.next(this.slots[this.currentSlot]
          .subSlots[this.subSlotIndex].name);

        // If collapsable
        if(this.slots[this.currentSlot].subSlots[this.subSlotIndex].subSlots && !this.slots[this.currentSlot].subSlots[this.subSlotIndex].showAsOptions){
          this.slots[this.currentSlot].subSlots[this.subSlotIndex].collapsed = !this.slots[this.currentSlot].subSlots[this.subSlotIndex].collapsed;
        }

      }
      else {
        this.slots[this.currentSlot]
          .onSelected.next(this.slots[this.currentSlot].name);
        // todo: reset subSlotIndex .active
        // If collapsable
        if(this.slots[this.currentSlot].subSlots && !this.slots[this.currentSlot].showAsOptions){
          this.slots[this.currentSlot].collapsed = !this.slots[this.currentSlot].collapsed;
          this.subSlotIndex = 0;
          this.setActive(this.slots[this.currentSlot].subSlots[0].name);
          if(this.slots[this.currentSlot].collapsed == true){
            this.subSlotIndex = -1;
          }
        }
      }
    }

    // Escape
    if(event.keyCode == 27 || event.keyCode == 8){
      if(this.subSlotIndex != -1){
        this.slots[this.currentSlot]
          .subSlots[this.subSlotIndex]
          .active = false;
        this.slots[this.currentSlot].collapsed = true;
        this.subSlotIndex = -1;
      }else {
        this.onCancel.emit();
      }
    }

    console.log("Options", event);

    // Options
    if(event.ctrlKey) {
      if(this.subSlotIndex != -1 && this.slots[this.currentSlot].subSlots[this.subSlotIndex].showAsOptions) {
        this.slots[this.currentSlot]
          .subSlots[this.subSlotIndex]
          .collapsed = !this.slots[this.currentSlot].subSlots[this.subSlotIndex].collapsed;
      }else if(this.slots[this.currentSlot].showAsOptions) {
        this.slots[this.currentSlot].collapsed = !this.slots[this.currentSlot].collapsed;
        this.subSlotIndex = 0;
        this.setActive(this.slots[this.currentSlot].subSlots[0].name);
        if(this.slots[this.currentSlot].collapsed == true){
          this.subSlotIndex = -1;
        }
      }
    }

  }

  private setActive(slotName: string) {
    this.slots.forEach(slot => {
      slot.active =  slot.name == slotName;
    });
  }
}
