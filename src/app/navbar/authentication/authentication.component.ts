import {Component, EventEmitter, OnInit} from '@angular/core';
import {DBService} from "../../services/db.service";
import {ModalService} from "../../services/modal.service";
import {ModalInput, ModalParameter} from "../../MenuManagement/modal/modal.component";
import {LogService} from "../../services/log.service";
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";

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
              private userService: UserService) {

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
        console.log("[SUCESS] SignIn", res);
      }, err => {
        console.log("Could not signIn",err);
      });
    });

    this.modalService.openModal(new ModalParameter("Sign In", [
      new ModalInput("Username", ""),
      new ModalInput("Password", "", null, true)
    ], signIn, "Please enter your credentials."));
  }

  onSignUp() {

    let signUp = new EventEmitter<any>();
    signUp.subscribe(inputs => {
      this.userService.signUp(inputs[0].value, inputs[1].value).subscribe(res => {
        console.log("AUTH-RES", res);
        // TODO: if res.err : ShowMessage(err); Just a bootstrap - toolbar with msg
      });
    });

    this.modalService.openModal(new ModalParameter("Sign Up", [
      new ModalInput("Username", ""),
      new ModalInput("Password", "", null, true)
    ], signUp));
  }

  onSignOut(){
    this.userService.signOut();
  }
}
