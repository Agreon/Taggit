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
}
