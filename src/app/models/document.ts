import {Storeable} from "./storeable";

export class Document extends Storeable {

  public type: string = "document";

  constructor(
    public name: string,
    public content: string = "",
    public cached: boolean = false
  ) {
    super();
    // Exclude cached
    this.excludedFromDB.push("cached");
  }


  public static fromJSON(object: any): Document {
    let document = new Document("");

    for(let attr in object){
      if(object.hasOwnProperty(attr)){
        document[attr] = object[attr];
      }
    }

    return document;
  }

  public getStoreableContent(): any {
    return super.getStoreableContent();
  }
}
