export abstract class Storeable {
    public _id: string = "";
    public type: string;
    public created_at: Date;
    public updated_at: Date;

    public abstract getStoreableContent(): any;
}
