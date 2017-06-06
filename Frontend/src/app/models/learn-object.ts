import {Storeable} from "./storeable";
import {StoreTag} from "./store-tag";

/**
 * Wrapper object for tag, so that learn-attributes dont have to be stored in main collection
 * TODO: We have to save the tagdata to the db as well, so that additional tags can be added
 		=> Maybe make it optional (if empty, load it from learnObject)
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
    public objectID: string
  ) {
    super();
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

  /**
   * Fills Tags from Learnable-Object
   * @param tags
   */
  public fillTagData(tags: Array<StoreTag>) {
    tags.forEach(tag => {

        if(tag.inputs.length < 2){
          return;
        }

        let updateTag = this.tags.filter(ownTag => {
          return ownTag.tagID == tag.id;
        });

        // If existing
        if(updateTag.length > 0){
          updateTag[0].tagData = tag;
        } else {
          this.tags.push(new LearnTag(tag.id, tag));
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
      found.tagData = tag.tagData;
    } else {
      this.tags.push(tag);
    }
  }

  public removeTag(tagID: string){
    this.tags = this.tags.filter(tag => {
      return tag.tagData.id !== tagID;
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
            obj.tags.push(new LearnTag(tag.tagID, tag.tagData, tag.level, tag.active));
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

    // TODO: ERROR ON SECOND SAVE
    console.log("Tags", this.tags);
    for (let tag of this.tags){
      content.tags.push(tag.getStoreableContent());
    }

    return content;
  }

}
