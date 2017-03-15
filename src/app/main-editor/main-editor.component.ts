import {Component, OnInit, OnDestroy, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
import {EditorService} from "../services/editor.service";
import {Subscription} from "rxjs";
import {LogService} from "../services/log.service";
import {Tag, TagInput} from "../models/tag";
import {TagService} from "../services/tag.service";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'main-editor',
  templateUrl: './main-editor.component.html',
  styleUrls: ['./main-editor.component.css']
})
export class MainEditorComponent implements AfterViewInit, OnDestroy {
  @Output() onEditorKeyUp = new EventEmitter();

  private editor;
  private subscription: Subscription;

  private tags: Tag[] = [];

  constructor(private editorService: EditorService, private tagService: TagService){

    let self = this;

    this.subscription = editorService.getContentInsert()
      .subscribe( content => {
        console.log("New content",content);
        LogService.log(content);
        this.editor.insertContent(content);
      });

    tagService.getTags().subscribe(tags => {
      this.tags = tags;
     /* for(let t of this.tags){
        this.editor.addButton('TagBar', {
          text: t.name,
          icon: false,
          onclick: function() {
            self.editor.insertContent(t.asHtml());
          }
        });
      }*/
    });



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
        this.editor = editor;

        let testTag = new Tag("Question",
          "Add a Question with Answer",
          "strg+1",
          [new TagInput("Question", "Input", "What does BMI mean?"),
            new TagInput("Answer", "Input", "Body Mass Index")]);

        tagService.addTag(testTag);

        /*for(let t of this.tags){
         editor.addButton('TagBar', {
         text: t.name,
         icon: false,
         onclick: function() {
         editor.insertContent(t.asHtml());
         }
         });
         }*/

      }
    });


  }

  ngAfterViewInit(): void {

    let self = this;
/*

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
        this.editor = editor;

        let testTag = new Tag("Question",
          "Add a Question with Answer",
          "strg+1",
          [new TagInput("Question", "Input", "What does BMI mean?"),
            new TagInput("Answer", "Input", "Body Mass Index")]);

        this.tagService.addTag(testTag);
      }
     //setup: this.editorSetup
    });*/
  }

  private editorSetup(editor) {

    let self = this;

    let testTag = new Tag("Question",
            "Add a Question with Answer",
            "strg+1",
            [new TagInput("Question", "Input", "What does BMI mean?"),
            new TagInput("Answer", "Input", "Body Mass Index")]);

    editor.addButton('TagBar', {
      text: "Insert Stuff",
      icon: false,
      onclick: function() {
        editor.insertContent(testTag.asHtml());
      }
    });

    editor.on('keyup', () => {
      const content = editor.getContent();
      self.onEditorKeyUp.emit(content);
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
