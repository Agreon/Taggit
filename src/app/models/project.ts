import {Document} from "./document";
import {LogService} from "../services/log.service";

export class Project {
  constructor(
    public name: string,
    public documents: Array<Document>
  ){}

  public saveDocument(document: Document) {
    let found = this.getDocument(document.name);

    if(found){
      let index = this.documents.indexOf(found);
      this.documents[index] = document;
    } else {
      this.documents.push(document);
    }
    LogService.log("Saved document in",this.documents);
  }

  public getDocument(name: string): Document {
    return this.documents.filter(d => {
      return d.name == name;
    })[0];
  }

}
