import {Component, HostListener, ViewChild} from '@angular/core';
import {LogService} from "./services/log.service";
import {InputService} from "./services/input.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private sidebarVisible: boolean = true;

  constructor(private inputService: InputService) {
  }

  private toggleSidebar(){
    this.sidebarVisible = !this.sidebarVisible;
  }

  //@HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.inputService.keyPress(event);
  }

  private onClickSidebar(){
    this.inputService.setActive("MenuContainer");
  }

}
