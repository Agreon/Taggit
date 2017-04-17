export abstract class Storeable {
    public _id: string = "";
    public type: string;
    public created_at: Date = new Date();
    public updated_at: Date = new Date();

    protected excludedFromDB = [
      "type",
      "excludedFromDB"
    ];

    public getStoreableContent(): any {
      let ret = {};

      for(let attr in this){
        if(this.hasOwnProperty(attr)){
          if(this.excludedFromDB.indexOf(attr) != -1){
            continue;
          }
          ret[attr] = this[attr];
        }
      }

      return ret;
    }

  public randomString(length): string {
    return Math.random().toString(length*2).slice(2);
  }
}
