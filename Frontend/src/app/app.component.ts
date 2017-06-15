import {Component, HostListener, ViewChild} from '@angular/core';
import {LogService} from "./services/log.service";
import {InputService} from "./services/input.service";
import {UserInformationService} from "./services/User-Information.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private sidebarVisible: boolean = true;
  private loading: boolean = false;

  constructor(private inputService: InputService, private userInformationService: UserInformationService) {
    userInformationService.getLoadingsSubject().subscribe(show => {
      this.loading = show;
    });
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
