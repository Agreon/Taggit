export class Document {
  constructor(
    public name: string,
    public content: string = "",
    public cached: boolean = false
  ) {}
}
