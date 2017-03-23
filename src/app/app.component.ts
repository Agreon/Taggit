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
    console.log("Toggle");
    this.sidebarVisible = !this.sidebarVisible;
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.inputService.keyPress(event);
  }

  private onClickSidebar(){
    this.inputService.setActive("MenuContainer");
  }

}
