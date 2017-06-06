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
import {LogService} from "../../../services/log.service";


/**
 * TOOD:
 * Git-Issue[9]: { Add Questions to LearnObject, that are not in it as tags
 * >>
 * HowTo Redesign 'AddQuestion'-Modal?
 *  You either have Extraction or Adding
 * Make it possible to delete it from list.
 * <<
 * [feature] }
 * Git-Issue[10]: Both buttons should be in one row, in responsive mode [bug]
 * Git-Issue: Revert all Questions of a type, or all questions of a LO [feature]
 */
@Component({
  selector: 'app-learn-settings',
  templateUrl: './learn-settings.component.html',
  styleUrls: ['./learn-settings.component.css']
})
export class LearnSettingsComponent implements OnInit {

  private learnObject: LearnObject;

  constructor(private learnService: LearnService,
              private userInformationService: UserInformationService,
              private dbService: DBService,
              private modalService: ModalService) {

    // TODO: This is called every time the route happens
    learnService.getLearnObject().subscribe(lo => {
      this.learnObject = lo;
      console.log("Update LO", this.learnObject);
    });

  }

  ngOnInit() {
  }

  private tagChanged(tag: LearnTag) {
    this.learnObject.addTag(tag);
  }

  private addQuestions(){

    let tags = this.learnService.getObjectTags();

    LogService.log("AllTags",tags);

    // Only get those with 2 inputs
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

    // TODO: Later remove, wehn questions can be added manually
    if(types.length == 0) {
      this.userInformationService.showInformation(new UserMessage(
        MessageType.WARNING,
        "All Tags with at least 2 Inputs of this Document are already added!"));
      return;
    }

    let onSelect = new EventEmitter<Array<ModalInput>>();
    onSelect.subscribe(res => {
      LogService.log("Selected", res);

      for(let tag of tags){
        if(tag.tagType == res[0].value){
          this.learnObject.tags.push(new LearnTag(tag.id,tag));
          break;
        }
      }

      /*if(res.filter(r => r.name == "Question")[0].length == 0) {
          LogService.log("Question not used");

          if(!res[2].value) {
              // TODO: Throw error
          }
          for(let tag of tags){
            if(tag.tagType == res[2].value){
              this.learnObject.tags.push(new LearnTag(tag.id,tag));
              break;
            }
          }
      } else {
         // TODO: Read Inputs
      }*/

      this.learnService.setLearnObject(this.learnObject);

      LogService.log("Saving..",this.learnObject);

      this.dbService.save(this.learnObject).subscribe(res => {
        console.log("Saved",res);
      }, err => {
        console.log("Err",err);        // TODO: Here?*/
      });
      return;
    });

    this.modalService.openModal(new ModalParameter(
      "Select Tag",
      [ //new ModalInput("Question", ""),
        //new ModalInput("Answer", ""),
        new ModalInput("Tag", types[0], "Or extract Tags", "select", types)],
      onSelect
    ));
  }

  private startLearning(){
    // Only if at least one active tag is selected, learn
    if(this.learnObject.tags.filter(tag => tag.active).length == 0){
      this.userInformationService.showInformation(new UserMessage(
        MessageType.WARNING,
        "You cannot learn without active tags"));
      return;
    }
    this.learnService.initLearning();
  }

}
