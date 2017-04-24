import {Component, EventEmitter, OnInit} from '@angular/core';
import {DBService} from "../../../services/db.service";
import {ModalService} from "../../../services/modal.service";
import {ModalInput, ModalParameter} from "../../MenuManagement/modal/modal.component";
import {LogService} from "../../../services/log.service";
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";
import {UserMessage, MessageType, UserInformationService} from "../../../services/User-Information.service";

@Component({
  selector: 'authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  private currentUser: User;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(res => {
      console.log("CurrentUser", res);
      this.currentUser = res;
    });
  }

  onSignOut(){
    this.userService.signOut();
  }
}
