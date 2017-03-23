import {Storeable} from "./storeable";

export class Document extends Storeable {

  public type: string = "document";

  constructor(
    public name: string,
    public content: string = "",
    public cached: boolean = false
  ) {
    super();
  }

  public fromJSON(object: any){
    for(let attr in object){
      if(object.hasOwnProperty(attr)){
        this[attr] = object[attr];
      }
    }
  }

  // TODO: Find out how to filter out values from stringify
  public getStoreableContent(): any {
    return {
      _id: this._id,
      name: this.name,
      content: this.content};
  }
}
