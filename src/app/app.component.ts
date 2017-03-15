import { Component } from '@angular/core';
import {LogService} from "./services/log.service";
import {EditorService} from "./services/editor.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private sidebarVisible: boolean = true;

  constructor(private editorService: EditorService) {
    editorService.insertContent("Inserted");
  }

  public handleEditorKeyUp(event: any): void {
    console.log(event);
    LogService.log(event);
  }

}
