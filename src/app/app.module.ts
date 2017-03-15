import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';

import { AppComponent } from './app.component';

// Services
import { TagService } from './services/tag.service';
import { EditorService } from './services/editor.service';
import { LogService } from './services/log.service';

// Components
import { MainEditorComponent } from './main-editor/main-editor.component';
import { MenuSlotComponent } from './MenuManagement/menu-slot/menu-slot.component';
import { MenuContainerComponent } from './MenuManagement/menu-container/menu-container.component';

@NgModule({
  declarations: [
    AppComponent,
    MainEditorComponent,
    MenuSlotComponent,
    MenuContainerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  providers: [TagService, EditorService, LogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
