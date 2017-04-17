import {Storeable} from "./storeable";
import {StoreTag} from "./store-tag";

/**
 * Wrapper object for tag, so that learn-attributes dont have to be stored in main collection
 */
export class LearnTag {
  constructor(
    public tagID: string,
    public tagData: StoreTag,
    public level: number = 0,
    public active: boolean = true
  ) {}

  public getStoreableContent(): any {
    return {tagID: this.tagID, level: this.level, active: this.active};
  }
}

/**
 * Holds all Tags that are part of a LearnObject like Document or Project
 */
export class LearnObject extends Storeable {
  public type: string = "learnObject";
  public tags: Array<LearnTag> = [];

  constructor(
    public objectID: string,
    public progress: number = 0
  ) {
    super();
    this.excludedFromDB.push("tags");
  }

  public getTagsOfType(type: string): Array<LearnTag> {
      return this.tags.filter(tag => {
        return tag.tagData.tagType == type;
      });
  }

  public getTagTypes(): Array<string> {
    let types: Array<string> = [];
    this.tags.forEach(tag => {
      let found = false;
      for(let i = 0; i < types.length; i++){
        if(types[i] == tag.tagData.tagType){
          found = true;
          break;
        }
      }
      if(!found){
        types.push(tag.tagData.tagType);
      }
    });
    return types;
  }

  public removeTag(tagID: string){
    this.tags = this.tags.filter(tag => {
      return tag.tagData.id !== tagID;
    });
  }

  public getProgress(): number {
    return 0;
  }


  // Storeable

  public static fromJSON(object: any): LearnObject {
    let obj = new LearnObject("");

    for(let attr in object){
      if(object.hasOwnProperty(attr)){
        obj[attr] = object[attr];
      }
    }

    return obj;
  }

  public getStoreableContent(): any {
    let content = super.getStoreableContent();
    content.tags = [];

    for (let tag of this.tags){
      content.tags.push(tag.getStoreableContent());
    }

    return content;
  }

}
