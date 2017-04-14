import {TagInput} from "./tag";

export class StoreTag {
  constructor(
    public id: string,
    public tagType: string,
    public inputs: Array<TagInput> = [],
    public level: number = 0,
    public active: boolean = true
  ) {}
}
