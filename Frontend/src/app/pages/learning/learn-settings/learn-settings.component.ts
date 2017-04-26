import {Component, EventEmitter, OnInit} from '@angular/core';
import {LearnService} from "../../../services/learn.service";
import {LearnObject, LearnTag} from "../../../models/learn-object";
import {MessageType, UserInformationService, UserMessage} from "../../../services/User-Information.service";
import {Router} from "@angular/router";
import {DBService} from "../../../services/db.service";
import {distinct} from "rxjs/operator/distinct";
import {ModalService} from "../../../services/modal.service";
import {ModalInput, ModalParameter} from "../../../components/MenuManagement/modal/modal.component";
import {Helper} from "../../../models/Helper";
import {find} from "rxjs/operator/find";


/**
 * TOOD:
 * Order-By Level
 *
 */
@Component({
  selector: 'app-learn-settings',
  templateUrl: './learn-settings.component.html',
  styleUrls: ['./learn-settings.component.css']
})
export class LearnSettingsComponent implements OnInit {

  private learnObject: LearnObject;

  constructor(private learnService: LearnService,
              private router: Router,
              private userInformationService: UserInformationService,
              private dbService: DBService,
              private modalService: ModalService) {

  }

  ngOnInit() {
    this.learnService.getLearnObject().subscribe(lo => {
      this.learnObject = lo;
      console.log("Update LO", this.learnObject);
    });
  }



  private addTags(){

    let tags = this.learnService.getObjectTags();

    console.log("AllTags",tags);

    tags = tags.filter(tag => tag.inputs.length > 1);

    let types = Helper.distinctArray(tags, "tagType");

    // Filter out if already in learnObject
    types = types.filter(type => {
      for (let tag of this.learnObject.tags){
        if(tag.tagData.tagType == type){
          return false;
        }
      }
      return true;
    });

    // TODO: If length == 0, deactivate button
    if(types.length == 0) {
      this.userInformationService.showInformation(new UserMessage(
        MessageType.WARNING,
        "All Tags with at least 2 Inputs of this Document are already added!"));
      return;
    }

    let onSelect = new EventEmitter<Array<ModalInput>>();
    onSelect.subscribe(res => {
      console.log("Selected", res);

      for(let tag of tags){
        if(tag.tagType == res[0].value){
          this.learnObject.tags.push(new LearnTag(tag.id,tag));
        }
      }
      this.learnService.setLearnObject(this.learnObject);
      this.dbService.save(this.learnObject); // TODO: Here?
    });

    this.modalService.openModal(new ModalParameter(
      "Select Tag",
      [new ModalInput("Tag", types[0], "", "select", types)],
      onSelect
    ));
  }

  private startLearning(){
    // Only if at least one active tag is selected, learn
    if(this.learnObject.tags.filter(tag => {return tag.active;}).length == 0){
      this.userInformationService.showInformation(new UserMessage(
        MessageType.WARNING,
        "You cannot learn without active tags"));
      return;
    }
    this.router.navigate(['/Learning']);
}

}
