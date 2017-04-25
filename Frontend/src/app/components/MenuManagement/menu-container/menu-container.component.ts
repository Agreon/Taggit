import {Component, OnInit, Input, HostListener, Output, EventEmitter, SimpleChanges, ViewChild} from '@angular/core';
import {Slot} from "../models/slot";
import {InputReceiver} from "../../../models/input-receiver";
import {InputService} from "../../../services/input.service";
import {MENU_TYPE} from "../menu-manager/menu-manager.component";

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

  @Input("Loading")
  loading: boolean;

  @Output("OnCancel")
  onCancel: EventEmitter<any> = new  EventEmitter<any>();

  @ViewChild('focusHandle') public focusHandle;

  private activeSlot: Slot;
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
     /* for(let slot of this.slots){
        slot.onHover.subscribe((slot) => {
          //this.setActive(slot);
        });
      }*/

      this.setActive(this.slots[0]);
      //this.activeSlot = this.slots[0];
    }
  }

  private backPressed(){
    this.onCancel.emit();
  }

  keyEvent(event: KeyboardEvent) {
    event.stopPropagation();

    // Down
    if(event.keyCode == 40) {
      if(this.activeSlot.collapsed) {
        if(this.currentSlot < this.slots.length - 1){
          this.currentSlot++;
          this.setActive(this.slots[this.currentSlot]);
        }
      } else {
        this.activeSlot.nextSubSlot();
      }
    }

    // Up
    if(event.keyCode == 38) {
      if(this.activeSlot.collapsed) {
        if(this.currentSlot > 0){
          this.currentSlot--;
          this.setActive(this.slots[this.currentSlot]);
        }
      } else {
        this.activeSlot.previousSubSlot();
      }
    }

    // Return
    if(event.keyCode == 13){
        this.activeSlot.selectSlot();
    }


    // Escape
    if(event.keyCode == 27 || event.keyCode == 8){
      if(this.activeSlot.collapsed){
        this.onCancel.emit();
      } else  {
        this.activeSlot.closeSlot();
      }
    }

    // Options
    if(event.keyCode == 17) {
      this.activeSlot.showOptions();
    }
    if(event.keyCode == 88){
        this.inputService.setActive("MainEditor");
        console.log("switch");
    }

  }

  private setActive(inSlot: Slot) {
    this.slots.forEach(slot => {
      if(slot.name == inSlot.name){
        slot.active = true;
        this.activeSlot = slot;
      }else {
        slot.active = false;
      }
    });
  }
}
