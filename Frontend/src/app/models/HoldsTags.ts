import {StoreTag} from "./store-tag";

export interface HoldsTags {
  _id: string;
  getTags(): Array<StoreTag>;
}
