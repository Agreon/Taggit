import { Injectable } from '@angular/core';
import {Project} from "../models/project";
import {Document} from "../models/document";
import {Subject, Observable, BehaviorSubject} from "rxjs";
import {HttpService} from "./http.service";

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
    // TODO: Load projects

    this.projects = [
      new Project("EWA",[
        new Document("Vorlesung 1","<p>BliBlaBlub</p>",true),
        new Document("Vorlesung 2", "<p>BluBlaBli</p>", true)
      ]),
      new Project("GDV",[]),
      new Project("Philo",[])
    ];

    this.httpService.getProjects().subscribe(projects => {
      console.log("Got projects",projects);
    }, err => {
      console.log("Err", err);
    });

    this.allProjectsSubject.next(this.projects);
  }

  public getProjects(): Observable<Project[]> {
    return this.allProjectsSubject.asObservable();
  }

  public addProject(project: Project): void {
    this.projects.push(project);
    this.allProjectsSubject.next(this.projects);
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

  public saveDocument(document: Document) {

    // TODO: Maybe get tags out of doc

    this.currentProject.saveDocument(document);

    // TODO: Save currentProject in DB?
    // Additionally the doc somewhere
    // so we need an id

    // Set cached
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
      // TODO: Load from db

      // Set cache-status
      doc.cached = true;
    }
  }

}
