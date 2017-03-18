
export class TagInput {
  constructor(
    public name: string,
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

  public getInput(name: string): TagInput {
    return this.inputs.filter( input => {
      return input.name == name;
    })[0];
  }

  public setInputValue(inputName: string, value: string) {
    for(let input of this.inputs) {
      if (input.name == inputName) {
        input.value = value;
        return;
      }
    }
  }

}


