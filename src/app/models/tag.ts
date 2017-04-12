
import {Storeable} from "./storeable";
export class TagInput {
  constructor(
    public name: string,
    public value: string
  ) {}
}

export class Tag extends Storeable{

    public type: string = "Tag";

    constructor(
      public name: string,
      public description: string,
      public hotkey: string,
      public inputs: TagInput[]
    ) {
      super();

    }

  /** Tags are written in the document like this, bc of editor restrictions
   <p class='tagged [tagname] [id]'>
   <strong>[InputName]: </strong>
   [InputValue]
   </p>
   **/
  public asHtml(): string {
    let retHtml = "";

    retHtml += "<span class='tagged "+this.name+"'>";

    let id = this.randomString(12);

    this.inputs.forEach((input) => {
      retHtml += "<p class='tagged "+this.name+" "+id+"'>";
      retHtml += "<strong>"+input.name+": </strong>";
      retHtml += input.value;
      retHtml += "</p>";
    });
    retHtml += "</span>";

    return retHtml;
  }

  public static fromJSON(object: any): Tag {
    let tag = new Tag(null, null, null, null);

    for(let param in tag) {
      if(object.hasOwnProperty(param)){
        tag[param] = object[param];
      }
    }

  /*  user._id = object._id;
    user.created_at = object.created_at;
    user.updated_at = object.updated_at;
*/
    return tag;
  }

  public getInput(name: string): TagInput {
    return this.inputs.filter( input => {
      return input.name == name;
    })[0];
  }

  public setInputValue(inputName: string, value: string) {
    for(let input of this.inputs) {
      if (input.name == inputName) {
        input.value = value;
        return;
      }
    }
  }

}


