import {Document} from "./document";
import {LogService} from "../services/log.service";
import {Storeable} from "./storeable";

export class Project extends Storeable {

  public type: string = "project";

  constructor(
    public name: string,
    public documents: Array<Document> = []
  ){
    super();
  }

  public saveDocument(document: Document) {
    let found = this.getDocument(document.name);

    if(found){
      let index = this.documents.indexOf(found);
      this.documents[index] = document;
    } else {
      this.documents.push(document);
    }
    LogService.log("Saved document in", this.documents);
  }

  public getDocument(name: string): Document {
    return this.documents.filter(d => {
      return d.name == name;
    })[0];
  }

  public getStoreableContent(): any {
    let content = {_id: this._id, name: this.name, documents: []};

    for (let doc of this.documents){
      content.documents.push({_id: doc._id, name: doc.name});
    }

    return content;
  }

}
