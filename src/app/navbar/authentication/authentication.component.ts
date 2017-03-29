import {Component, EventEmitter, OnInit} from '@angular/core';
import {HttpService} from "../../services/http.service";
import {ModalService} from "../../services/modal.service";
import {ModalInput, ModalParameter} from "../../MenuManagement/modal/modal.component";
import {LogService} from "../../services/log.service";

@Component({
  selector: 'authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  constructor(private httpService: HttpService,
              private modalService: ModalService) {

  }

  ngOnInit() {
  }

  onSignIn() {

    let signIn = new EventEmitter<any>();
    signIn.subscribe(inputs => {
      LogService.log("Credential", inputs);
    });

    LogService.log("SignIn");

    this.modalService.openModal(new ModalParameter("Sign In", [
      new ModalInput("Username", ""),
      new ModalInput("Password", "")
    ], signIn));
  }

  onSignUp() {

    let signUp = new EventEmitter<any>();
    signUp.subscribe(inputs => {
      LogService.log("Credentials", inputs);
    });

    this.modalService.openModal(new ModalParameter("Sign Up", [
      new ModalInput("Username", ""),
      new ModalInput("Password", "")
    ], signUp);
  }
}
