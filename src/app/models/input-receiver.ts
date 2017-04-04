import {ViewChild} from "@angular/core";

export interface InputReceiver {
  focusHandle: ViewChild;
  keyEvent(event: KeyboardEvent);
}
