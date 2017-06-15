import {Storeable} from "./storeable";
import {StoreTag} from "./store-tag";
import {Helper} from "./Helper";
import {LogService} from "../services/log.service";

/**
 * Wrapper object for tag, so that learn-attributes dont have to be stored in main collection
 */
export class LearnTag {
  constructor(
    public tagID: string,
    public tagType: string,
    public question: string,
    public answer: string,
    public level: number = 0,
    public active: boolean = true
  ) {}

  public fromJSON(obj: any): LearnTag {
    for(let attr in obj) {
      if (this.hasOwnProperty(attr)) {
        this[attr] = obj[attr];
      }
    }
    return this;
  }

  public getStoreableContent(): any {

    let retObj = {};

    for(let attr in this) {
      if (this.hasOwnProperty(attr)) {
          retObj[attr] = this[attr];
      }
    }

    return retObj;
  }
}

/**
 * Holds all Tags that are part of a LearnObject like Document or Project
 */
export class LearnObject extends Storeable {
  public type: string = "learnObject";
  public tags: Array<LearnTag> = [];

  constructor(
    public objectID: string
  ) {
    super();
  }

  public getTagsOfType(type: string): Array<LearnTag> {
      return this.tags.filter(tag => {
        return tag.tagType == type;
      });
  }

  public getTagTypes(): Array<string> {
    return Helper.distinctArray(this.tags, "tagType");
  }

  /**
   * Fills Tags from Learnable-Object
   * Git-Issue: Only add those types to learnObj, that are already added [bug]
   * @param tags
   */
  public fillTagData(tags: Array<StoreTag>) {
    tags.forEach(tag => {

        if(tag.inputs.length < 2){
          return;
        }

        let updateTag = this.tags.filter(ownTag => {
          return ownTag.tagID == tag.id;
        })[0];



        // If existing
        if(updateTag){
          updateTag.question = tag.inputs[0].value;
          updateTag.answer = tag.inputs[1].value;
        } else {
          this.tags.push(new LearnTag(tag.id, tag.tagType, tag.inputs[0].value, tag.inputs[1].value));
        }
    });
  }

  /**
   * Adds a Tag and updates a tag if already existing
   * @param tag
   */
  public addTag(tag: LearnTag){
    let found = this.tags.filter(ownTag => {
        return ownTag.tagID == tag.tagID;
    })[0];

    if(found){
      found.level = tag.level;
      found.active = tag.active;
      found.question = tag.question;
      found.answer = tag.answer;
    } else {
      this.tags.push(tag);
    }
  }

  /**
   * TODO: Not used
   * @param tagID
   */
  public removeTag(tagID: string){
    this.tags = this.tags.filter(tag => {
      return tag.tagID !== tagID;
    });
  }

  /**
   * Returns the whole progress of the learnobject according to the level of the tags
   * @returns {number}
   */
  public getProgress(): number {
    let max = this.tags.length * 3;
    let current = 0;

    for(let tag of this.tags) {
        current += tag.level;
    }

    return (current / max) * 100;
  }


  // Storeable
  public static fromJSON(object: any): LearnObject {
    let obj = new LearnObject("");

    for(let attr in object){
      if(object.hasOwnProperty(attr)){
        if(attr == "tags"){
          obj.tags = [];
          for(let tag of object.tags){
            obj.tags.push(new LearnTag("","","","").fromJSON(tag));
          }
          continue;
        }

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
