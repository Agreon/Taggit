import { Injectable } from '@angular/core';
import {Project} from "../models/project";
import {Document} from "../models/document";
import {Subject, Observable, BehaviorSubject} from "rxjs";

@Injectable()
export class ProjectService {

  private allProjectsObs = new Subject<Project[]>();
  private currentProjectObs = new BehaviorSubject<Project>(null);

  private projects: Project[] = [];

  private currentProject: Project;

  constructor() { }

  /**
   * Load all projects of a user
   */
  public loadProjects(): void {
    // TODO: Load projects

    this.projects = [
      new Project("EWA",[
        new Document("Vorlesung 1","BliBlaBlub",true),
        new Document("Vorlesung 2")
      ]),
      new Project("GDV",[]),
      new Project("Philo",[])
    ];

    this.allProjectsObs.next(this.projects);
  }

  public getProjects(): Observable<Project[]> {
    return this.allProjectsObs.asObservable();
  }

  public addProject(project: Project): void {
    this.projects.push(project);
    this.allProjectsObs.next(this.projects);
  }

  public setCurrentProject(project: Project) {
    this.currentProject = project;
    this.currentProjectObs.next(this.currentProject);
  }

  public getCurrentProject(): Observable<Project> {
    return this.currentProjectObs.asObservable();
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
  public loadDocumentContent(name: string): Document {
    //if(this.currentProject.documents)
    let doc = this.currentProject.getDocument(name);
    // If cached just return it
    if(doc.cached){
        return doc;
    } else {
      // TODO: Load from db

      // Set cache-status
      doc.cached = true;
    }
  }

}
