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
    this.excludedFromDB.push("documents");
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

  public removeDocument(document: Document){

      LogService.log("Removed document", document);
  }

  public getDocument(name: string): Document {
    return this.documents.filter(d => {
      return d.name == name;
    })[0];
  }

  /**
   * TOOD: Documents are just ids
   * @param object
   * @returns {Project}
   */
  public fromJSON(object: any): void {

    for(let attr in object){
      if(object.hasOwnProperty(attr) &&
        attr != "documents"){
        this[attr] = object[attr];
      }
    }

    // TODO: Test

    // Add new documents
    object.documents.forEach(doc => {
      if(this.documents.filter(ownDoc => {
          return ownDoc._id == doc._id;
        }).length == 0){
          this.documents.push(Document.fromJSON(doc));
      }
    });

    // Check if documents still in project
    /*this.documents = this.documents.filter(doc => {
      return object.documents.indexOf(docMeta => {
          // If in array
          if(doc._id == docMeta._id){
            // update doc-name
            doc.name = docMeta.name;
            return true;
          }
          return false;
      }) != -1;
    });*/
  }

  public getStoreableContent(): any {
    let content = super.getStoreableContent();
    content.documents = [];

    for (let doc of this.documents){
      content.documents.push({_id: doc._id, name: doc.name});
    }

    return content;
  }

}
