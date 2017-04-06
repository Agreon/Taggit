import { Injectable } from '@angular/core';
import {Project} from "../models/project";
import {Document} from "../models/document";
import {Subject, Observable, BehaviorSubject, Observer, ReplaySubject} from "rxjs";
import {DBService} from "./db.service";
import {LogService} from "./log.service";
import {MessageType, UserInformationService, UserMessage} from "./User-Information.service";

/**
 * TODO: Order Methods
 */
@Injectable()
export class ProjectService {

  private allProjectsSubject = new Subject<Project[]>();
  private currentProjectSubject = new ReplaySubject<Project>(1);
  private currentDocumentSubject = new ReplaySubject<Document>(1);

  private projects: Project[] = [];

  private currentProject: Project;
  private currentDocument: Document;

  constructor(private httpService: DBService,
              private informationService: UserInformationService) { }

  /**
   * Load all projects of a user
   */
  public loadProjects(): void {
    this.httpService.get("project").subscribe(res => {
      this.projects = res.map(project => {
        let proj = new Project("");
        proj.fromJSON(project);
        return proj;
      });

      LogService.log("Projects loaded", this.projects);

      this.allProjectsSubject.next(this.projects);
    });
  }

  public createProject(name: string) {
    this.httpService.create(new Project(name)).subscribe(res => {

      // Fill with attribtues
      let proj = new Project("");
      proj.fromJSON(res);

      this.projects.push(proj);
      this.allProjectsSubject.next(this.projects);

      // Inform User
      this.informationService.showInformation(new UserMessage(
        MessageType.SUCCESS,
        "Project "+proj.name+" created."
      ));
    });
  }

  public renameProject(project: Project, name: string): Observable<any> {
    LogService.log("Rename project", name)
    project.name = name;

    return this.httpService.save(project);
  }

  public deleteProject(project: Project) {
    this.httpService.remove(project).subscribe(() => {
      this.informationService.showInformation(new UserMessage(
        MessageType.SUCCESS,
        "Project "+project.name+" deleted"
      ));
    });
  }

  public getProjects(): Observable<Project[]> {
    return this.allProjectsSubject.asObservable();
  }

  public setCurrentProject(project: Project) {
    this.currentProject = project;
    this.currentProjectSubject.next(this.currentProject);
  }

  public getCurrentProject(): Observable<Project> {
    return this.currentProjectSubject.asObservable();
  }

  public setCurrentDocument(document: Document) {
    this.currentDocument = document;
    this.currentDocumentSubject.next(this.currentDocument);
  }

  public getCurrentDocument(): Observable<Document> {
    return this.currentDocumentSubject.asObservable();
  }

  /**
   * TODO: Make Observable return?
   * @param document
   */
  public saveDocument(document: Document) {

    // TODO: Maybe get tags out of doc

    console.log("Save doc", document);

    this.currentProject.saveDocument(document);

    this.httpService.save(document).subscribe((doc) => {
        this.httpService.save(this.currentProject).subscribe(() => {
            this.informationService.showInformation(new UserMessage(
              MessageType.SUCCESS,
              "Saved Document."
            ));
        });
      });
  }

  /**
   * @param name
   */
  public createDocument(name: string) {
    console.log("Create",name);
    this.httpService.create(new Document(name)).subscribe(document => {
      document.cached = true;
      this.currentDocument = Document.fromJSON(document);
      this.currentProject.saveDocument(this.currentDocument);
      this.currentProjectSubject.next(this.currentProject);
      this.currentDocumentSubject.next(this.currentDocument);

      console.log("Create doc", this.currentDocument);

      // TODO: This throws error?
      this.httpService.save(this.currentProject).subscribe(() => {
        // Inform User
        this.informationService.showInformation(new UserMessage(
          MessageType.SUCCESS,
          "Document "+document.name+" created."
        ));
      });
    });
  }

  public renameDocument(document: Document, name: string) {
    document.name = name;
    console.log("Rename document", this.currentProject, document);

    this.currentProject.saveDocument(document);

    this.httpService.save(this.currentProject).subscribe(() => {
     console.log("Saved proj");
      this.httpService.save(document).subscribe(() => {
        console.log("Saved doc");
        // Inform User
        this.informationService.showInformation(new UserMessage(
          MessageType.SUCCESS,
          "Document renamed."
        ));
      });
    });

  }

  public deleteDocument(document: Document): Observable<any> {

    // Delete from project
    this.currentProject.removeDocument(document);

    this.httpService.save(this.currentProject).subscribe(() => {
      // Inform User
      this.informationService.showInformation(new UserMessage(
        MessageType.SUCCESS,
        "Document "+document.name+" deleted."
      ));
    });
    return this.httpService.remove(document);
  }


  /**
   * Gets the content of a document
   * @param name
   */
  public loadDocumentContent(name: string): Observable<string> {

    let doc = this.currentProject.getDocument(name);

    return Observable.create((observer: Observer<string>) => {
      if(doc.cached){
        observer.next(doc.content);
      } else {
        // Load from db
        this.httpService.get("document", doc._id).subscribe(document => {
          console.log("got doc", document);
          this.currentDocument = Document.fromJSON(document);
          // Set cache-status
          this.currentDocument.cached = true;
          this.currentProject.saveDocument(this.currentDocument);
          observer.next(this.currentDocument.content);
        });
      }
    });
  }
}
