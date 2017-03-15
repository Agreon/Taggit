import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

// Services
import { TagService } from './services/tag.service';
import { EditorService } from './services/editor.service';
import { LogService } from './services/log.service';

// Components
import { MainEditorComponent } from './main-editor/main-editor.component';
import { MenuSlotComponent } from './MenuManagement/menu-slot/menu-slot.component';
import { MenuContainerComponent } from './MenuManagement/menu-container/menu-container.component';
import { MainMenuComponent } from './MenuManagement/main-menu/main-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    MainEditorComponent,
    MenuSlotComponent,
    MenuContainerComponent,
    MainMenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [TagService, EditorService, LogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
