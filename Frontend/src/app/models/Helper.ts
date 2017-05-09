export class Helper {

  /**
   * Distincts an Array by a selected parameter
   * @param arr
   * @param param
   * @returns {Array<any>}
   */
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

  /**
   * Shuffles an Array
   * @param input
   * @returns {Array}
   */
  public static shuffleArray(input: Array<any>): Array<any> {
      let retArr = [];
      let alreadyUsed = [];

      // Init full length
      for(let i = 0; i < input.length; i++){
        retArr.push(null);
      }

      for(let i = 0; i < input.length; i++){
          let rand;

          // Search for free place in target array
          do {
            rand = Math.floor(Math.random() * input.length);
          } while(this.contains(alreadyUsed, rand));

          retArr[rand] = input[i];
          alreadyUsed.push(rand);
      }

      return retArr;
  }

  public static contains(arr: Array<any>, search: any): boolean {
      for(let a of arr){
        if(a === search){
          return true;
        }
      }
      return false;
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
