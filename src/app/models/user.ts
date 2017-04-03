import {Storeable} from "./storeable";

export class User extends Storeable {
  public type: string = "User";

  constructor(
    public username: string,
    public password: string
  ) {
    super();
  }

  public static fromJSON(object: any): User {
    let user = new User(object.local.username, null);

    user._id = object._id;
    user.created_at = object.created_at;
    user.updated_at = object.updated_at;

    return user;
  }
}
