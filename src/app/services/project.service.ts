import { Injectable } from '@angular/core';
import {Project} from "../models/project";
import {Document} from "../models/document";
import {Subject, Observable, BehaviorSubject} from "rxjs";
import {HttpService} from "./http.service";
import {LogService} from "./log.service";

@Injectable()
export class ProjectService {

  private allProjectsSubject = new Subject<Project[]>();
  private currentProjectSubject = new BehaviorSubject<Project>(null);
  private currentDocumentSubject = new BehaviorSubject<Document>(null);

  private projects: Project[] = [];

  private currentProject: Project;
  private currentDocument: Document;

  constructor(private httpService: HttpService) { }

  /**
   * Load all projects of a user
   */
  public loadProjects(): void {
    this.httpService.get("project").subscribe( projects => {
      console.log("Got projects",projects);
      this.projects = projects;
      this.allProjectsSubject.next(this.projects);
    }, err => {
      console.log("Err", err);
    });
  }

  public createProject(name: string) {
    this.httpService.create(new Project(name)).subscribe(proj => {
      this.projects.push(proj);
      this.allProjectsSubject.next(this.projects);
    }, err => {
      console.log("Err", err);
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

    // Set cached if initial? => nein passiert bei create
  }

  /**
   * Observable return
   * @param document
   */
  public createDocument(document: Document) {
      console.log("Creating doc", document);
      this.httpService.create(document).subscribe(doc => {
          console.log("Created document", doc);
          //this.currentProject.saveDocument(doc);
      }, err => {
        console.log("Error creating document", err);
      });
  }

  /**
   * TODO: Get Doc from DB and save it in currentProject-docs
   * Gets the content of a document
   * @param name
   */
  public loadDocumentContent(name: string): string {
    //if(this.currentProject.documents)
    let doc = this.currentProject.getDocument(name);
    // If cached just return it
    if(doc.cached){
        return doc.content;
    } else {
      // Load from db
      this.httpService.get("document", doc._id).subscribe(document => {
        // Set cache-status
        doc.cached = true;
        console.log("Got doc", document);
        this.currentProject.saveDocument(document);
      }, err => { LogService.log("Error getting doc content", err)});

    }
  }

}
