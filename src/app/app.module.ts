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
import { MainMenuComponent } from './MenuManagement/menus/main-menu/main-menu.component';
import { MenuManagerComponent } from './MenuManagement/menu-manager/menu-manager.component';
import { ProjectViewMenuComponent } from './MenuManagement/menus/project-view-menu/project-view-menu.component';
import { MenuTemplateComponent } from './MenuManagement/menus/menu-template/menu-template.component';
import {ProjectService} from "./services/project.service";

@NgModule({
  declarations: [
    AppComponent,
    MainEditorComponent,
    MenuSlotComponent,
    MenuContainerComponent,
    MainMenuComponent,
    MenuManagerComponent,
    ProjectViewMenuComponent,
    MenuTemplateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [TagService, EditorService, LogService, ProjectService],
  entryComponents: [AppComponent, MainMenuComponent, ProjectViewMenuComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
