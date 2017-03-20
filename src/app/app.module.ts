import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
//import { TooltipModule } from 'ng2-bootstrap';

// Services
import { TagService } from './services/tag.service';
import { EditorService } from './services/editor.service';
import { LogService } from './services/log.service';
import { InputService } from './services/input.service';

// Components
import { MainEditorComponent } from './main-editor/main-editor.component';
import { MenuSlotComponent } from './MenuManagement/menu-slot/menu-slot.component';
import { MenuContainerComponent } from './MenuManagement/menu-container/menu-container.component';
import { MainMenuComponent } from './MenuManagement/menus/main-menu/main-menu.component';
import { MenuManagerComponent } from './MenuManagement/menu-manager/menu-manager.component';
import { ProjectViewMenuComponent } from './MenuManagement/menus/project-view-menu/project-view-menu.component';
import { MenuTemplateComponent } from './MenuManagement/menus/menu-template/menu-template.component';
import {ProjectService} from "./services/project.service";
import {Routes, RouterModule} from "@angular/router";
import { TagButtonComponent } from './main-editor/tag-button/tag-button.component';
import { NavbarComponent } from './navbar/navbar.component';
import {HttpService} from "./services/http.service";

const appRoutes: Routes = [
  { path: 'MainEditor', component: MainEditorComponent},
  { path: '', redirectTo: 'MainEditor', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    MainEditorComponent,
    MenuSlotComponent,
    MenuContainerComponent,
    MainMenuComponent,
    MenuManagerComponent,
    ProjectViewMenuComponent,
    MenuTemplateComponent,
    TagButtonComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
    //,TooltipModule.forRoot()
  ],
  providers: [TagService, EditorService, LogService, InputService, ProjectService, HttpService],
  entryComponents: [AppComponent, MainMenuComponent, ProjectViewMenuComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
