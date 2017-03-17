
export class TagInput {
  constructor(
    public name: string,
    public type: string,
    public value: string
  ) {}
}

export class Tag {
    constructor(
      public name: string,
      public description: string,
      public hotkey: string,
      public inputs: TagInput[]
    ) {}

  public asHtml(): string {
    let retHtml = "";

    retHtml += "<p class='tagged "+ this.name + "'>";
    this.inputs.forEach((input) => {
      retHtml += "<p id='"+input.name+"'>";
      retHtml += "<strong>"+input.name+": </strong>";
      retHtml += input.value;
      retHtml += "</p>";
    });

    retHtml += "</p>";

    return retHtml;
  }

}


