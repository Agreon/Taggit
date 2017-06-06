import {Storeable} from "./storeable";
import {StoreTag} from "./store-tag";
import {TagInput} from "./tag";
import {HoldsTags} from "./HoldsTags";
import {LogService} from "../services/log.service";

export class Document extends Storeable implements HoldsTags{

  public type: string = "document";
  public tags: Array<StoreTag> = [];

  constructor(
    public name: string,
    public content: string = "",
    public projectID: string = "",
    public cached: boolean = false
  ) {
    super();
    // Exclude cached
    this.excludedFromDB.push("cached");
    this.excludedFromDB.push("tags");
  }

  /**
   * Extracts Tags from the current content
   */
  public extractTags(): void {
    let self = this;

    self.tags = [];

    this.find(self.content, "tagged", function(pos){
      try {
        let name = self.getUntil(self.content, " ", pos += 7);
        let id = self.getUntil(self.content, '"', pos += name.length + 1);

        let inputName = self.getUntil(self.content, ':', pos += (id.length + 10));
        let inputValue = self.getUntil(self.content, '<', pos += (inputName.length + 11));
        let tagInput = new TagInput(inputName, inputValue);

        let found = self.tags.filter(tag => {
          return tag.id == id;
        })[0];

        if(!found){
          self.tags.push(new StoreTag(id, name, [tagInput]));
        } else {
          found.inputs.push(tagInput);
        }
      } catch(exception) {
        console.log("ERROR SAVING", exception);
      }
    });

    LogService.log("Tags in doc", this.tags);
  }

  private getUntil(content: string, delim: string, start: number): string {
    let ret = "";

    for(let i = start; i < content.length; i++){
      if(content[i] == delim){
        break;
      }
      ret += content[i];
    }
    return ret;
  }

  private find(content: string, search: string, callback: any) {
    let j;

    for(let i = 0; i < content.length - search.length; i++){
        for(j = 0; j < search.length; j++){
          if(content[i+j] != search[j]){
            break;
          }
        }
        // If found
        if(j == search.length){
          callback(i);
          i = i+j;
        }
    }
  }

  // Tags

  getTags(): Array<StoreTag> {
    return this.tags;
  }

  // Storeable

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
    let content = super.getStoreableContent();
    content.tags = [];

    for (let tag of this.tags){

      let _inputs = [];
      for(let input of tag.inputs){
        _inputs.push({name: input.name, value: input.value});
      }

      content.tags.push({id: tag.id, tagType: tag.tagType, inputs: _inputs});
    }

    return content;
  }
}
