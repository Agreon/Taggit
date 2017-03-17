import {Component, OnInit, OnDestroy, AfterViewInit, Input, Output, EventEmitter, HostListener} from '@angular/core';
import {EditorService} from "../services/editor.service";
import {Subscription} from "rxjs";
import {LogService} from "../services/log.service";
import {Tag, TagInput} from "../models/tag";
import {TagService} from "../services/tag.service";
import {Document} from "../models/document";
import {forEach} from "@angular/router/src/utils/collection";
import {ProjectService} from "../services/project.service";
import {ActivatedRouteSnapshot, ActivatedRoute} from "@angular/router";

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
export class MainEditorComponent implements AfterViewInit, OnDestroy {
  @Output() onEditorKeyUp = new EventEmitter();

  private document: Document;

  private editor;
  private subscription: Subscription;

  private tags: Tag[] = [];

  constructor(private projectService: ProjectService,
              private tagService: TagService){

    let self = this;
    this.subscription = tagService.getTags().subscribe(tags => {
      this.tags = tags;

      LogService.log("Tags",tags);

      this.initEditor();

      for(let t of this.tags){
        this.addTagButton(t);
      }
      if(this.document.content){
        self.editor.setContent(this.document.content);
      }
    });

    self.document = new Document("","");

     this.projectService.getCurrentDocument().subscribe(d => {
        if(!d){
          return;
        }

        this.document = d;

        // TODO: Load project
        let content = this.projectService.loadDocumentContent(this.document.name);

        self.editor.setContent(content);
    });
  }

  private tagClicked(tag: Tag){
    console.log("Tag clicked",tag);
    this.editor.insertContent(tag.asHtml());
  }

  /**
   * Adds a tag-button to the editor
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


   /* this.hotkeysService.add(new Hotkey('meta+shift+g', (event: KeyboardEvent): boolean => {
      console.log('Typed hotkey');
      return false; // Prevent bubbling
    }));
*/
  }
/*
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log("Event",event);

    if(event.ctrlKey && event.keyCode == 1){
          this.editor.insertContent(this.tags[0].asHtml());
      }
  }*/

  ngAfterViewInit(): void {

  }

  private initEditor(){
    let self = this;
    tinymce.init({
      selector: '#mainEditor',
      plugins: ['link', 'paste', 'table', 'save'],
      skin_url: 'assets/skins/lightgray',
      toolbar: 'save | insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | TagBar',
      menubar: true,
      height: "100%",
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
      // TODO: disable menu-ctrl thorugh service
      console.log("focus");
    });

    editor.on('init', function(args) {
      console.log("Editor inited");
    });

    for(let tag of this.tags){
      editor.addShortcut(tag.hotkey, tag.name, () => {
        editor.insertContent(tag.asHtml());
      });
    }

    this.editor = editor;
  }

  ngOnDestroy(): void {
    tinymce.remove(this.editor);
    this.subscription.unsubscribe();
  }
}
