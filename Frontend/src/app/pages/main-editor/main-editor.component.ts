import {
  Component, OnInit, OnDestroy, AfterViewInit, Input, Output, EventEmitter, HostListener,
  ViewChild
} from '@angular/core';
import {Subscription} from "rxjs";
import {LogService} from "../../services/log.service";
import {Tag, TagInput} from "../../models/tag";
import {TagService} from "../../services/tag.service";
import {Document} from "../../models/document";
import {ProjectService} from "../../services/project.service";
import {InputService} from "../../services/input.service";
import {InputReceiver} from "../../models/input-receiver";
import {ModalService} from "../../services/modal.service";
import {ModalInput, ModalParameter} from "../../components/MenuManagement/modal/modal.component";
import {UserInformationService} from "../../services/User-Information.service";

/**
 * TODO:
 * + Tag-Toolbar
 * + Styling
 * + remove Selfs
 */
/**
 * Git-Issue[#8]: Show Scrollbar, but remove it from main-window [style]
 * Git-Issue[#17]: Auto-Focus modal-input, maybe use built in >> https//www.tinymce.com/docs/advanced/creating-custom-dialogs/ << [feature]
 * Git-Issue: When Tag-Data is changed, the parsing may won't work >> Maybe make it not changeable.. << [bug]
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
  private currentContent: string = "<p></p>";

  private tags: Tag[] = [];

  constructor(private projectService: ProjectService,
              private tagService: TagService,
              private inputService: InputService,
              private modalService: ModalService,
              private userInformationService: UserInformationService){

    inputService.addReciever("MainEditor",this);

    this.userInformationService.startLoading();

    let self = this;

    this.subscription = tagService.getTags().subscribe(tags => {
      this.tags = tags;

      LogService.log("Tags",tags);

      //this.initEditor();

      if(this.document.content){
        self.editor.setContent(this.document.content);
      }
    });

     this.projectService.getCurrentDocument()
       .distinctUntilChanged()
       .subscribe(d => {
       LogService.log("Current Doc", d);
       this.document = d;
         this.userInformationService.startLoading();

       this.projectService.loadDocumentContent(this.document._id).subscribe(doc => {
         LogService.log("Got Content", doc.content);

         this.userInformationService.stopLoading();

         tinymce.EditorManager.execCommand("mceAddEditor",true, "mainEditor");
         self.editor = tinymce.EditorManager.editors[0];

         this.currentContent = doc.content;

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
    LogService.log("editor focused");

    if(this.editor){
      this.editor.focus();
    }
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
        LogService.log("Editor Setup");
        self.editorSetup(editor);

        // Just bc...
        setTimeout(() => {
          self.editor.setContent(self.currentContent);
          self.editor.focus();
        }, 10);
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
      console.log("Focus");
      this.inputService.setActive("MainEditor");
    });

    editor.on('init', function(args) {

    });

    // Curstom shortcuts

    // Switch to Menu
    editor.addShortcut("alt+w", "MenuSwitch", () => {
      // Has to be done this way, thanks to tinymce
      setTimeout(() => {
        tinymce.EditorManager.execCommand("mceRemoveEditor",true, "mainEditor");
        this.editor = null;
      },20);
      this.inputService.setActive("MenuContainer");
      console.log("switch");
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
