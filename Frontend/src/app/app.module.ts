import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
//import { TooltipModule } from 'ng2-bootstrap';

// Services
import { TagService } from './services/tag.service';
import { LogService } from './services/log.service';
import { InputService } from './services/input.service';
import { ModalService } from "./services/modal.service";
import { UserService } from "./services/user.service";
import { UserInformationService } from "./services/User-Information.service";
import { LearnService } from "./services/learn.service";

// Components
import { MainEditorComponent } from './pages/main-editor/main-editor.component';
import { MenuSlotComponent } from './components/MenuManagement/menu-slot/menu-slot.component';
import { MenuContainerComponent } from './components/MenuManagement/menu-container/menu-container.component';
import { MainMenuComponent } from './components/MenuManagement/menus/main-menu/main-menu.component';
import { MenuManagerComponent } from './components/MenuManagement/menu-manager/menu-manager.component';
import { ProjectViewMenuComponent } from './components/MenuManagement/menus/project-view-menu/project-view-menu.component';
import { MenuTemplateComponent } from './components/MenuManagement/menus/menu-template/menu-template.component';
import {ProjectService} from "./services/project.service";
import {CookieService} from "angular2-cookie/core";
import {Routes, RouterModule} from "@angular/router";
import { TagButtonComponent } from './pages/main-editor/tag-button/tag-button.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import {DBService} from "./services/db.service";
import { ModalComponent } from './components/modal/modal.component';
import { AuthenticationComponent } from './components/navbar/authentication/authentication.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { LearningComponent } from './pages/learning/learning/learning.component';
import { FlashcardComponent } from './pages/learning/learning/flashcard/flashcard.component';
import { TagListComponent } from './pages/learning/learn-settings/tag-list/tag-list.component';
import { ProgressBarComponent } from './pages/learning/progress-bar/progress-bar.component';
import { LearnSettingsComponent } from './pages/learning/learn-settings/learn-settings.component';
import { IntroductionComponent } from './pages/introduction/introduction.component';
import { AddTagModalComponent } from './components/modal/modal-types/add-tag-modal/add-tag-modal.component';

const appRoutes: Routes = [
  { path: 'document/:id', component: MainEditorComponent},
  { path: 'Overview', component: OverviewComponent},
  { path: 'Learning', component: LearningComponent},
  { path: 'LearnSettings', component: LearnSettingsComponent},
  { path: '', component: IntroductionComponent}
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
    NavbarComponent,
    ModalComponent,
    AuthenticationComponent,
    SnackbarComponent,
    OverviewComponent,
    LearningComponent,
    FlashcardComponent,
    TagListComponent,
    ProgressBarComponent,
    LearnSettingsComponent,
    IntroductionComponent,
    AddTagModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
    //,TooltipModule.forRoot()
  ],
  providers: [TagService, ModalService, LearnService, LogService, InputService, ProjectService, DBService, UserService, UserInformationService, CookieService],
  entryComponents: [AppComponent, MainMenuComponent, ProjectViewMenuComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
