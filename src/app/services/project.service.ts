import { Injectable } from '@angular/core';
import {Project} from "../models/project";
import {Document} from "../models/document";
import {Subject, Observable, BehaviorSubject, Observer} from "rxjs";
import {DBService} from "./db.service";
import {LogService} from "./log.service";

/**
 * TODO: Order Methods
 */
@Injectable()
export class ProjectService {

  private allProjectsSubject = new Subject<Project[]>();
  private currentProjectSubject = new BehaviorSubject<Project>(null);
  private currentDocumentSubject = new BehaviorSubject<Document>(null);

  private projects: Project[] = [];

  private currentProject: Project;
  private currentDocument: Document;

  constructor(private httpService: DBService) { }

  /**
   * Load all projects of a user
   */
  public loadProjects(): void {
    this.httpService.get("project").subscribe( projects => {
      console.log("Got projects",projects);
      projects = projects.data;

      this.projects = projects.map(project => {
        let proj = new Project("");
        proj.fromJSON(project);
        return proj;
      });
      console.log("Save them as",this.projects);

      //this.projects = projects;
      this.allProjectsSubject.next(this.projects);
    }, err => {
      console.log("Err", err);
    });
  }

  public createProject(name: string) {
    this.httpService.create(new Project(name)).subscribe(project => {

      // Fill with ids and so on
      let proj = new Project("");
      proj.fromJSON(project);

      this.projects.push(proj);
      this.allProjectsSubject.next(this.projects);
    }, err => {
      console.log("Err Creating project", err);
    });
  }

  public renameProject(project: Project, name: string): Observable<Project> {
    LogService.log("Rename project", name)
    project.name = name;

    return this.httpService.save(project);
  }

  public deleteProject(project: Project): Observable<any> {
    return this.httpService.remove(project);
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

    // TODO: Save currentProject in DB?
    this.httpService.save(this.currentProject).subscribe(() => {
        console.log("Saved project to db", this.currentProject);
      },
      err => {
        console.log("Error saving project to db", err);
      }
    );

    this.httpService.save(document).subscribe((doc) => {
        console.log("Saved document to db", doc);
      },
      err => {
        console.log("Error saving document to db", err);
      }
    );
  }

  /**
   * TODO: Observable/Promise return
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

      this.httpService.save(this.currentProject).subscribe(() => {
        console.log("Project updated");
      }, err => {
        console.log("Err project update", err);
      });

    }, err => {
      console.log("Err Creating document", err);
    });
  }

  public renameDocument(document: Document, name: string): Observable<Document> {
    document.name = name;
    LogService.log("Rename document", document);

    this.currentProject.saveDocument(document);

    this.httpService.save(this.currentProject).subscribe(() => {
      console.log("Project updated");
    }, err => {
      console.log("Err project update", err);
    });

    return this.httpService.save(document);
  }

  public deleteDocument(document: Document): Observable<any> {
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
        }, err => { LogService.log("Error getting doc content", err); });
      }
    });
  }
}
