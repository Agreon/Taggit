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
        "Project " + proj.name + " created."
      ));
    });
  }

  public renameProject(project: Project, name: string): Observable<any> {
    LogService.log("Rename project", name);
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

  public saveDocument(document: Document): void {
    console.log("Save doc", document);

    document.extractTags();

    this.currentProject.saveDocument(document);

    this.httpService.save(document).subscribe((doc) => {
      this.httpService.save(this.currentProject).subscribe(() => {
        // Inform user
        this.informationService.showInformation(new UserMessage(
          MessageType.SUCCESS,
          "Saved Document."
        ));
      });
    });
  }

  /**
   * TODO: Give back Observers
   * @param name
   */
  public createDocument(name: string, projectID: string): void {
   /* console.log("Create", name);
    return new Promise<boolean>((resolve, reject) => {
      this.httpService.create(new Document(name)).subscribe(document => {
        document.cached = true;
        this.currentDocument = Document.fromJSON(document);
        this.currentProject.saveDocument(this.currentDocument);
        this.currentProjectSubject.next(this.currentProject);
        this.currentDocumentSubject.next(this.currentDocument);

        console.log("Create doc", this.currentDocument);

        this.httpService.save(this.currentProject).subscribe(() => {
          // Inform User
          this.informationService.showInformation(new UserMessage(
            MessageType.SUCCESS,
            "Document " + document.name + " created."
          ));
          resolve(true);
        }, err => {reject(false);});
      }, err => {reject(false);});
    });*/
     this.httpService.create(new Document(name, "", projectID)).subscribe(document => {
       document.cached = true;
       this.currentDocument = Document.fromJSON(document);
       this.currentProject.saveDocument(this.currentDocument);
       this.currentProjectSubject.next(this.currentProject);
       this.currentDocumentSubject.next(this.currentDocument);

       console.log("Create doc", this.currentDocument);

       this.httpService.save(this.currentProject).subscribe(() => {
       // Inform User
       this.informationService.showInformation(new UserMessage(
       MessageType.SUCCESS,
       "Document "+document.name+" created."
       ));
       });
     });
  }

  /**
   * TODO: Give Back Observer!
   * @param document
   * @param name
   */
  public renameDocument(document: Document, name: string): Observable<any> {
    return this.loadDocumentContent(document._id).flatMap(doc => {
      doc.name = name;
      this.currentProject.saveDocument(doc);
      return this.httpService.save(this.currentProject).flatMap(() => {
          return this.httpService.save(doc);
      })
    });
  }

  /**
   * TODO: Give back observer
   * @param document
   * @returns {Observable<any>}
   */
  public deleteDocument(document: Document): Observable<any> {

    // Delete from project
    this.currentProject.removeDocument(document);

    this.httpService.save(this.currentProject).subscribe(() => {
      // Inform User
      this.informationService.showInformation(new UserMessage(
        MessageType.SUCCESS,
        "Document " + document.name + " deleted."
      ));
    });
    return this.httpService.remove(document);
  }


  /**
   * Gets the content of a document
   * @param id
   */
  public loadDocumentContent(id: string): Observable<Document> {

    let doc = this.currentProject.getDocument(id);

    return Observable.create((observer: Observer<Document>) => {
      if (doc.cached) {
        observer.next(doc);
      } else {
        // Load from db
        this.httpService.get("document", doc._id).subscribe(document => {
          let fullDocument = Document.fromJSON(document);
          fullDocument.cached = true;
          this.currentProject.saveDocument(fullDocument);
          observer.next(fullDocument);
        });
      }
    });
  }



}
