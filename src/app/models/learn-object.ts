import {Storeable} from "./storeable";
import {StoreTag} from "./store-tag";

/**
 * Holds all Tags that are part of a LearnObject like Document or Project
 *
 *
 *
 *
 */
export class LearnObject extends Storeable {
  public type: string = "learnobject";
  public tags: Array<StoreTag> = [];

  constructor(
    public objectID: string,
    public progress: number = 0
  ) {
    super();
  }

  public getTagsOfType(type: string): Array<StoreTag> {
      return this.tags.filter(tag => {
        return tag.tagType == type;
      });
  }

  public removeTag(tagID: string){
    this.tags = this.tags.filter(tag => {
      return tag.id !== tagID;
    });
  }

}
