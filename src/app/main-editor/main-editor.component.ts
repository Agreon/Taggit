import {Component, OnInit, OnDestroy, AfterViewInit, Input, Output, EventEmitter, HostListener} from '@angular/core';
import {Subscription} from "rxjs";
import {LogService} from "../services/log.service";
import {Tag, TagInput} from "../models/tag";
import {TagService} from "../services/tag.service";
import {Document} from "../models/document";
import {forEach} from "@angular/router/src/utils/collection";
import {ProjectService} from "../services/project.service";
import {ActivatedRouteSnapshot, ActivatedRoute} from "@angular/router";
import {InputService} from "../services/input.service";
import {InputReceiver} from "../models/input-receiver";
import {ModalService} from "../services/modal.service";
import {ModalInput, ModalParameter} from "../MenuManagement/modal/modal.component";

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

      this.initEditor();

      if(this.document.content){
        self.editor.setContent(this.document.content);
      }
    });

     this.projectService.getCurrentDocument().subscribe(d => {
        if(!d){
          return;
        }

       console.log("Current Doc", d);
       this.document = d;

       this.projectService.loadDocumentContent(this.document.name).subscribe(content => {
         console.log("Got Content", content);
         self.editor.setContent(content);
         self.editor.focus();
       });
    });
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
      if(i == 0){
        newInput['value'] = this.editor.selection.getContent();
      }

      inputs.push(newInput);
    }

    let param = new ModalParameter("Insert Tag", inputs, insertTag);

    this.modalService.openModal(param);

    insertTag.subscribe(inputs => {
      for(let data in inputs){
        tag.setInputValue(data,inputs[data]);
      }
      this.editor.insertContent(tag.asHtml());
      this.editor.selection.setContent("");
    });
  }
  /**
   * TODO:
   * + Maybe add Description and Tooltips
   * @param tag
   */
  private openDialog2(tag: Tag){

    let inputs = [];

    for(let i = 0; i < tag.inputs.length; i++){
      let newInput = {
        name: tag.inputs[i].name,
        label: tag.inputs[i].name,
        type: 'textbox'
        //,tooltip: input.description
      };

      // Set selection as value for first input
      if(i == 0){
        newInput['value'] = this.editor.selection.getContent();
      }

      inputs.push(newInput);
    }

    let self = this;

    this.editor.windowManager.open({
      title: 'Add Tag',
      body: inputs,
      onsubmit: function(e){
        for(let data in e.data){
          tag.setInputValue(data,e.data[data]);
        }
        self.editor.insertContent(tag.asHtml());
        self.editor.selection.setContent("");
      }
    });
  }




  ngAfterViewInit(): void {

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
    editor.addShortcut("ctrl+alt+w", "MenuSwitch", () => {
      this.inputService.setActive("MenuContainer");
      console.log("switch");
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
