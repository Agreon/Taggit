import {StoreTag} from "./store-tag";

export interface HoldsTags {
  _id: string;
  type: string;
  getTags(): Array<StoreTag>;
}
