import {Component, OnInit, OnDestroy, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
import {EditorService} from "../services/editor.service";
import {Subscription} from "rxjs";
import {LogService} from "../services/log.service";
import {Tag, TagInput} from "../models/tag";
import {TagService} from "../services/tag.service";
import {Document} from "../models/document";
import {forEach} from "@angular/router/src/utils/collection";
import {ProjectService} from "../services/project.service";

/**
 * TODO:
 * + Tag-Toolbar
 *  + Eigene wird wohl leichter sein
 * + Plugins
 *    + Save usw
 * + Styling
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

  constructor(private projectService: ProjectService, private tagService: TagService){

    // TODO: Delete old tags
    this.subscription = tagService.getTags().subscribe(tags => {
      this.tags = tags;

      LogService.log(tags);

      for(let t of this.tags){
        this.addTagButton(t);
      }
    });

    let self = this;

    self.document = new Document("Test");

    this.projectService.getCurrentProject().subscribe(p => {
      self.document = p.documents[0];
    });
  }

  /**
   * Adds a tag-button to the editor
   * @param tag
   */
  private addTagButton(tag: Tag): void {

    let editor = this.editor;

    editor.addButton(tag.name, {
      text: tag.name,
      icon: false,
      onclick: function() {
        editor.insertContent(tag.asHtml());
      }
    });

    let btn = editor.buttons[tag.name];
    let group = editor.theme.panel.find("toolbar buttongroup").length;
    let bg = editor.theme.panel.find("toolbar buttongroup")[group-1];
    console.log(bg);
    bg._lastRepaintRect = bg._layoutRect;
    bg.append(btn);
  }

  ngAfterViewInit(): void {
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

    this.editor = editor;
    let self = this;

    editor.on('keyup', () => {
      const content = editor.getContent();
      self.onEditorKeyUp.emit(content);
    });

    let testTag = new Tag("Question",
      "Add a Question with Answer",
      "strg+1",
      [new TagInput("Question", "Input", "What does BMI mean?"),
        new TagInput("Answer", "Input", "Body Mass Index")]);


    self.editor.on('init', function(args) {
      // Custom logic
      console.log("Editor inited");
      self.tagService.addTag(testTag);
    });

    // editor.shortcuts.add('ctrl+1', function() {
    //    editor.insertContent(testTag.asHtml());
    // });

    this.editor = editor;
  }

  ngOnDestroy(): void {
    tinymce.remove(this.editor);
    this.subscription.unsubscribe();
  }
}
