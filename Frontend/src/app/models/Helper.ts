export class Helper {
  public static distinctArray(arr: Array<any>, param?: string): Array<any> {
    let retArr: Array<any> = [];
    arr.forEach(elem => {

      let found = false;
      for(let i = 0; i < retArr.length; i++){
        if(param){
          if(retArr[i] == elem[param]){
            found = true;
            break;
          }
        } else {
          if(retArr[i] == elem){
            found = true;
            break;
          }
        }
      }
      if(!found){
        if(param){
          retArr.push(elem[param]);
        }else {
          retArr.push(elem);
        }
      }
    });

    return retArr;
  }

  public static convertUmlautes(input: string): string {
      input = input.replace("&auml;","ä");
      input = input.replace("&ouml;","ö");
      input = input.replace("&üuml;","ü");

      input = input.replace(/\u00dc/g,"Ü");
      input = input.replace(/\u00fc/g,"ü");

      input = input.replace(/\u00c4/g,"Ä");
      input = input.replace(/\u00e4/g,"ä");

      input = input.replace(/\u00d6/g,"Ö");
      input = input.replace(/\u00f6/g,"ö");

      input = input.replace(/\u00df/g,"ß");

      return input;
  }
}
