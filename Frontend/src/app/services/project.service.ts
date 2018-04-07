import {Injectable} from '@angular/core';
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
              private informationService: UserInformationService) {
  }

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

  /**
   * TODO: Save project in db
   * @param name
   */
  public createProject(name: string): void {
    this.httpService.create(new Project(name)).subscribe(res => {

      // Fill with attribtues
      let proj = new Project("");
      proj.fromJSON(res);

      this.projects.push(proj);
      this.allProjectsSubject.next(this.projects);

      // Inform User
      this.informationService.showInformation(new UserMessage(
        MessageType.SUCCESS,
        "Project " + proj.name + " created."
      ));
    });
  }

  public async renameProject(project: Project, name: string): Promise<any> {
    LogService.log("Rename project", name);
    project.name = name;

    await this.httpService.save(project);
  }

  public async deleteProject(project: Project): Promise<any> {
    await this.httpService.remove(project);
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

  public async saveDocument(document: Document): Promise<any> {
    console.log("Save doc", document);

    document.extractTags();

    await this.httpService.save(document);

    this.informationService.showInformation(new UserMessage(
      MessageType.SUCCESS,
      "Saved Document."
    ));
  }

  public async createDocument(name: string, projectID: string): Promise<Document> {
    let document = await this.httpService.create(new Document(name, "", projectID)).toPromise();

    document.cached = true;
    this.currentDocument = Document.fromJSON(document);
    this.currentProject.saveDocument(this.currentDocument);
    this.currentProjectSubject.next(this.currentProject);
    this.currentDocumentSubject.next(this.currentDocument);

    console.log("Create doc", this.currentDocument);

    await this.httpService.save(this.currentProject);

    return document;
  }

  public async renameDocument(document: Document, name: string): Promise<any> {
    let doc = await this.loadDocumentContent(document._id);
    doc.name = name;
    this.currentProject.saveDocument(doc);
    await Promise.all([this.httpService.save(this.currentProject), this.httpService.save(doc)]);
  }


  public async deleteDocument(document: Document): Promise<any> {
    // Delete from project
    this.currentProject.removeDocument(document);

    await Promise.all([this.httpService.save(this.currentProject), this.httpService.remove(document)]);
  }


  /**
   * Gets the content of a document
   * @param id
   */
  public async loadDocumentContent(id: string): Promise<Document> {

    // If not initialized
    if(!this.currentProject){
       // Git-Issue: Project is not selected, undefined on page reload! [bug]
    }

    let doc = this.currentProject.getDocument(id);

    if (doc.cached) {
      return doc;
    }

    // Load from db
    let document = await this.httpService.get("document", doc._id).toPromise();
    let fullDocument = Document.fromJSON(document);
    fullDocument.cached = true;
    this.currentProject.saveDocument(fullDocument);
    return fullDocument;
  }


}
