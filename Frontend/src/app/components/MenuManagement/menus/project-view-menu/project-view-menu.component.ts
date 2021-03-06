import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {MenuTemplateComponent} from "../menu-template/menu-template.component";
import {MENU_TYPE, MenuEvent} from "../../menu-manager/menu-manager.component";
import {Subject} from "rxjs";
import {Slot} from "../../models/slot";
import {ProjectService} from "../../../../services/project.service";
import {Document} from "../../../../models/document";
import {Project} from "../../../../models/project";
import {Router, ActivatedRoute, NavigationExtras} from "@angular/router";
import {ModalInput, ModalParameter} from "../../../modal/modal.component";
import {ModalService} from "../../../../services/modal.service";
import {LogService} from "../../../../services/log.service";
import {LearnService} from "../../../../services/learn.service";
import {MessageType, UserInformationService, UserMessage} from "../../../../services/User-Information.service";

@Component({
  selector: 'project-view-menu',
  templateUrl: './project-view-menu.component.html',
  styleUrls: ['./project-view-menu.component.css']
})
export class ProjectViewMenuComponent extends MenuTemplateComponent implements OnInit{

  private selectedDocument = new Subject<Document>();
  private createDocument = new Subject<string>();
  private renameDocument = new Subject<Document>();
  private deleteDocument = new Subject<Document>();
  private overviewDocument = new Subject<Document>();
  private learnDocument = new Subject<Document>();

  private project: Project;
  private currentDocument: Document;

  constructor(private projectService: ProjectService,
              private learnService: LearnService,
              private modalService: ModalService,
              private informationService: UserInformationService,
              private router: Router) {
    super();

    // On Project-Load
    this.projectService.getCurrentProject().subscribe(project => {
      console.log("Got Project", project);

      this.project = project;
      this.updateView();
    });

    // On Project-Select
    this.selectedDocument.subscribe(d => {

      this.slots.forEach(slot => {
        slot.active = slot.name == d.name;
      });
      this.router.navigate(['/document', d._id]);
    });


    let onCreate = new EventEmitter<Array<ModalInput>>();

    // Create Document Callback
    onCreate.subscribe(inputs => {
      this.projectService.createDocument(inputs[0].value, this.project._id).then((doc) => {

        this.router.navigate(['document', doc._id]);

        this.informationService.stopLoading();

        this.informationService.showInformation(new UserMessage(
          MessageType.SUCCESS,
          "Document "+inputs[0].value+" created."
        ));
      });
    });

    // On Create Document-Button
    this.createDocument.subscribe(() => {
      console.log("CreateProject");
      let param = new ModalParameter("New Document",[
        new ModalInput("Name","")
      ], onCreate, "MenuContainer");
      this.modalService.openModal(param);
    });

    // Rename Document
    let onRename = new EventEmitter<Array<ModalInput>>();

    this.renameDocument.subscribe((document) => {

      this.currentDocument = document;

      LogService.log("Rename Document", document);
      let param = new ModalParameter("Rename Document",[
        new ModalInput("Name", document.name)
      ], onRename, "MenuContainer");
      this.modalService.openModal(param);
    });


    onRename.subscribe(inputs => {


      // Rename Document in DB
      this.projectService.renameDocument(this.currentDocument, inputs[0].value)
        .then(() => {

          // Set Name of project without reloading menu
          let currentSlot = this.slots.filter(s => {
            return s.eventPayload && s.eventPayload._id == this.currentDocument._id;
          })[0];

          currentSlot.name = inputs[0].value;
          currentSlot.closeSlot();

        // Inform User
        this.informationService.showInformation(new UserMessage(
          MessageType.SUCCESS,
          "Document renamed."
        ));
      });

    });

    // Overview Document
    this.overviewDocument.subscribe((document) => {
      this.currentDocument = document;
      LogService.log("Overview Document", document);
      //this.projectService.setCurrentDocument(document);
      this.router.navigate(['/Overview']);
    });

    // Learn Document
    this.learnDocument.subscribe((document) => {
      this.currentDocument = document;
      LogService.log("Learn Document", document);

      // Get whole document if not cached // TODO: Start Loading
      this.projectService.loadDocumentContent(document._id).then(doc => {
        this.projectService.setCurrentDocument(doc);
        this.learnService.startLearning(doc);
      });

    });

    /**
     * @type {EventEmitter<Array<ModalInput>>}
     */
    // Delete Document
    let onDelete = new EventEmitter<Array<ModalInput>>();

    this.deleteDocument.subscribe((document) => {
      this.currentDocument = document;
      LogService.log("Delete Document", document);
      let param = new ModalParameter("Delete Document",[], onDelete, "MenuContainer", "Are you sure?");
      this.modalService.openModal(param);
    });

    onDelete.subscribe(inputs => {
      this.projectService.deleteDocument(this.currentDocument).then(res => {
        LogService.log("Deleted Document", res);

        let toDelete = -1;
        for(let i = 0; i < this.slots.length; i++){
          if(this.slots[i].eventPayload && this.slots[i].eventPayload._id == this.currentDocument._id){
            toDelete = i;
            break;
          }
        }

        if(toDelete != -1){
            this.slots.splice(toDelete, 1);
        }
        this.informationService.showInformation(new UserMessage(
          MessageType.SUCCESS,
          "Document " + this.currentDocument.name + " deleted."
        ));
      }).catch(err => {
        console.log("Could not delete",err);
      });
    });
  }

  ngOnInit() {
  }

  public updateView(): void {
    this.slots = [];

    // Create Menu
    this.slots.push(new Slot("Create Document", "plus", null, false, this.createDocument));

    if(this.project.documents.length < 1){
      return;
    }

    this.project.documents.forEach(d => {
      this.slots.push(new Slot(d.name,"file-text", [
        new Slot("Overview", "pencil", null, false, this.overviewDocument, false, true, d),
        new Slot("Learn", "leanpub", null, false, this.learnDocument, false, true, d),
        new Slot("Rename", "pencil", null, false, this.renameDocument, false, true, d),
        new Slot("Delete", "trash", null, false, this.deleteDocument, false, true, d)
      ], true, this.selectedDocument, false, true, d));
    });

    if(this.slots.length < 1){
      return;
    }

    this.slots[0].active = true;
  }

  private cancel(): void {
    this.changeMenu.next(new MenuEvent(MENU_TYPE.MAIN_MENU, {}));
  }

}

