import {Component, EventEmitter, OnInit} from '@angular/core';
import {DBService} from "../../../services/db.service";
import {ModalService} from "../../../services/modal.service";
import {ModalInput, ModalParameter} from "../../MenuManagement/modal/modal.component";
import {LogService} from "../../../services/log.service";
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";
import {UserMessage, MessageType, UserInformationService} from "../../../services/User-Information.service";

/**
 * TODO:
 * + style signout like in adminlte
 * + maybe login/register with small icons
 */
@Component({
  selector: 'authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  private currentUser: User;

  constructor(private modalService: ModalService,
              private userService: UserService,
              private informationService: UserInformationService) {

  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(res => {
      console.log("CurrentUser", res);
      this.currentUser = res;
    });
  }

  onSignIn() {

    let signIn = new EventEmitter<any>();
    signIn.subscribe(inputs => {
      this.userService.logIn(inputs[0].value,inputs[1].value).subscribe(res => {
        if(!res.success){
          this.informationService.showInformation(new UserMessage(
            MessageType.ERROR,
            res.msg
          ));
          return;
        }

        this.informationService.showInformation(new UserMessage(
          MessageType.SUCCESS,
          "LogIn successfull!"
        ));

      });
    });

    this.modalService.openModal(new ModalParameter("Sign In", [
      new ModalInput("Username", ""),
      new ModalInput("Password", "", null, "hidden")
    ], signIn, "MenuContainer", "Please enter your credentials."));
  }

  onSignUp() {

    let signUp = new EventEmitter<any>();
    signUp.subscribe(inputs => {
      this.userService.signUp(inputs[0].value, inputs[1].value).subscribe(res => {
        console.log("AUTH-RES", res);
        if(!res.success){
          this.informationService.showInformation(new UserMessage(
            MessageType.ERROR,
            res.msg
          ));
          return;
        }

        this.informationService.showInformation(new UserMessage(
          MessageType.SUCCESS,
          "Register successfull!"
        ));
      });
    });

    this.modalService.openModal(new ModalParameter("Sign Up", [
      new ModalInput("Username", ""),
      new ModalInput("Password", "", null, "hidden")
    ], signUp, "MenuContainer", "Please enter your credentials."));
  }

  onSignOut(){
    this.userService.signOut();

    this.informationService.showInformation(new UserMessage(
      MessageType.SUCCESS,
      "LogOut successfull!"
    ));
  }
}
