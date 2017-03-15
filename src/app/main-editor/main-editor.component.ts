import {Component, OnInit, OnDestroy, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
import {EditorService} from "../services/editor.service";
import {Subscription} from "rxjs";
import {LogService} from "../services/log.service";
import {Tag, TagInput} from "../models/tag";

@Component({
  selector: 'main-editor',
  templateUrl: './main-editor.component.html',
  styleUrls: ['./main-editor.component.css']
})
export class MainEditorComponent implements AfterViewInit, OnDestroy {
  @Output() onEditorKeyUp = new EventEmitter();

  private editor;
  private subscription: Subscription;

  constructor(private editorService: EditorService){
    this.subscription = editorService.getContentInsert()
      .subscribe( content => {
        console.log("New content",content);
        LogService.log(content);
        this.editor.insertContent(content);
      });
  }

  ngAfterViewInit(): void {

    let self = this;

    let testTag = new Tag("Question",
      "Add a Question with Answer",
      "strg+1",
      [new TagInput("Question", "Input", "What does BMI mean?"),
        new TagInput("Answer", "Input", "Body Mass Index")]);


    tinymce.init({
      selector: '#mainEditor',
      plugins: ['link', 'paste', 'table'],
      skin_url: 'assets/skins/lightgray',
      toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | TagBar',
      menubar: true,
      setup: function(editor){
        editor.on('keyup', () => {
          const content = editor.getContent();
          self.onEditorKeyUp.emit(content);
        });

       editor.addButton('TagBar', {
         text: "Insert Stuff",
         icon: false,
         onclick: function() {
           editor.insertContent(testTag.asHtml());
         }
       });

        this.editor = editor;
      }
     // setup: this.editorSetup
    });
  }

  private editorSetup(editor) {

    let self = this;

    let testTag = new Tag("Question",
            "Add a Question with Answer",
            "strg+1",
            [new TagInput("Question", "Input", "What does BMI mean?"),
            new TagInput("Answer", "Input", "Body Mass Index")]);

    editor.addButton('InsertStuff', {
      text: "Insert Stuff",
      icon: false,
      onclick: function() {
        console.log("InsertContent")
        editor.insertContent(testTag.asHtml());
      }
    });

    editor.on('keyup', () => {
      const content = editor.getContent();
      self.onEditorKeyUp.emit(content);
    });

    this.editor = editor;
  }

  ngOnDestroy(): void {
    tinymce.remove(this.editor);
    this.subscription.unsubscribe();
  }
}
