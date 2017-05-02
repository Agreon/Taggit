import {
  Component, OnInit, OnDestroy, AfterViewInit, Input, Output, EventEmitter, HostListener,
  ViewChild
} from '@angular/core';
import {Subscription} from "rxjs";
import {LogService} from "../../services/log.service";
import {Tag, TagInput} from "../../models/tag";
import {TagService} from "../../services/tag.service";
import {Document} from "../../models/document";
import {forEach} from "@angular/router/src/utils/collection";
import {ProjectService} from "../../services/project.service";
import {ActivatedRouteSnapshot, ActivatedRoute} from "@angular/router";
import {InputService} from "../../services/input.service";
import {InputReceiver} from "../../models/input-receiver";
import {ModalService} from "../../services/modal.service";
import {ModalInput, ModalParameter} from "../../components/MenuManagement/modal/modal.component";

/**
 * TODO:
 * + Tag-Toolbar
 *  + Eigene wird wohl leichter sein
 * + Plugins
 *    + Save usw
 * + Styling
 * + remove Selfs
 */
@Component({
  selector: 'main-editor',
  templateUrl: './main-editor.component.html',
  styleUrls: ['./main-editor.component.css']
})
export class MainEditorComponent implements AfterViewInit, OnDestroy, InputReceiver {
  @Output() onEditorKeyUp = new EventEmitter();

  @ViewChild('focusHandle') public focusHandle;

  private document: Document;

  private editor;
  private subscription: Subscription;

  private tags: Tag[] = [];

  constructor(private projectService: ProjectService,
              private tagService: TagService,
              private inputService: InputService,
              private modalService: ModalService){

    inputService.addReciever("MainEditor",this);

    let self = this;

    this.subscription = tagService.getTags().subscribe(tags => {
      this.tags = tags;

      LogService.log("Tags",tags);

      //this.initEditor();

      if(this.document.content){
        self.editor.setContent(this.document.content);
      }
    });

     this.projectService.getCurrentDocument().subscribe(d => {
       console.log("Current Doc", d);
       this.document = d;

       this.projectService.loadDocument(this.document._id).subscribe(doc => {
         console.log("Got Content", doc.content);

         if(self.editor){
           self.editor.setContent(doc.content);
           // TODO: Maybe throws exception
           self.editor.focus();
         }

       });
    });
  }

  ngAfterViewInit(){
    this.initEditor();
  }

  private tagClicked(tag: Tag){
    this.openDialog(tag);
  }

  private contentClicked(){
    console.log("Content");
    this.editor.focus();
  }

  /**
   * Adds a tag-button to the editor7
   * CURRENTLY NOT USED
   * @param tag
   */
  private addTagButton(tag: Tag): void {

    // temp
    // temp
    if(tag)
      return;

    let editor = this.editor;

    console.log("AddTagButton",tag);

    editor.addButton(tag.name, {
      text: tag.name,
      icon: false,
      onclick: function() {
        editor.insertContent(tag.asHtml());
      }
    });

    console.log("AddButton");

    let btn = editor.buttons[tag.name];
    let group = editor.theme.panel.find("toolbar buttongroup").length;
    let bg = editor.theme.panel.find("toolbar buttongroup")[group-1];
    console.log("bg",bg);
    bg._lastRepaintRect = bg._layoutRect;
    bg.append(btn);

    console.log("ahaha");

  }

  private openDialog(tag: Tag) {
    let insertTag = new EventEmitter<Array<ModalInput>>();

    let inputs = [];

    for(let i = 0; i < tag.inputs.length; i++){
      let newInput = new ModalInput(tag.inputs[i].name, "");

      // Set selection as value for first input
      if(i == 0 && this.editor.selection){
        newInput['value'] = this.editor.selection.getContent();
      }

      inputs.push(newInput);
    }

    this.modalService.openModal(new ModalParameter("Insert Tag - "+tag.name, inputs, insertTag, "MainEditor"));

    insertTag.subscribe(inputs => {
      for(let data of inputs){
        tag.setInputValue(data.name,data.value);
      }

      this.editor.insertContent(tag.asHtml());
      if(this.editor.selection){
        this.editor.selection.setContent("");
      }
    });
  }

  keyEvent(event: KeyboardEvent) {
  }

  private initEditor(){
    let self = this;
    tinymce.init({
      selector: '#mainEditor',
      inline: true,
      fixed_toolbar_container: '#editorToolbar',
      plugins: ['lists', 'advlist','link', 'paste', 'table', 'save', 'textpattern'],
      insert_button_items: 'image link | inserttable',
      skin_url: 'assets/skins/lightgray',
      toolbar: 'save | insertfile undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image ',
      menubar: true,
      height: "100%",
      resize: false,
      setup: function(editor){
        self.editorSetup(editor);
      },
      save_onsavecallback: function() {
        self.document.content = self.editor.getContent();
        self.projectService.saveDocument(self.document);
      }
    });
  }

  private editorSetup(editor) {

    editor.on('keyup', () => {
      const content = editor.getContent();
      this.onEditorKeyUp.emit(content);
    });

    editor.on('focus', () => {
      this.inputService.setActive("MainEditor");
    });

    editor.on('init', function(args) {
    });

    // Curstom shortcuts

    // Switch to Menu
    editor.addShortcut("alt+w", "MenuSwitch", () => {
      this.inputService.setActive("MenuContainer");
      console.log("switch");
     // editor.execCommand('mceFocus', false);
      //tinymce.execCommand("mceFocus", false );
      // TODO: Remove focus

    });

    // Add Tag Shortcuts
    for(let i = 0; i < this.tags.length; i++){
    //for(let tag of this.tags){
      editor.addShortcut(this.tags[i].hotkey, this.tags[i].name, () => {
        this.openDialog(this.tags[i]);
      });
    }

    this.editor = editor;
  }

  ngOnDestroy(): void {
    tinymce.remove(this.editor);
    this.subscription.unsubscribe();
  }
}
