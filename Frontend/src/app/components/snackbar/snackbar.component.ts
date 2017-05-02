import { Component, OnInit } from '@angular/core';
import {UserInformationService, UserMessage, MessageType} from "../../services/User-Information.service";

@Component({
  selector: 'snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent implements OnInit {

  private message: UserMessage;
  private alertType: string;

  private hidden: boolean = true;

  constructor(private informationService: UserInformationService) {


    //informationService
    informationService.getInformation().subscribe(msg => {
      this.message = msg;

      this.alertType = "alert ";
      if(msg.type == MessageType.ERROR) {
        this.alertType += "alert-danger ";
      } else if(msg.type == MessageType.WARNING) {
        this.alertType += "alert-warning ";
      } else if(msg.type == MessageType.SUCCESS) {
        this.alertType += "alert-success ";
      }
      this.alertType += "alert-dismissible";

      this.show();
    });
  }

  ngOnInit() {
  }

  private show(){
    console.log("Show Alert", this.message);
    this.hidden = false;
    setTimeout(() => {
      this.hide();
    },3500);
  }

  private hide(){
    this.hidden = true;
  }

}
