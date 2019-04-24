import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  filtroArrayObjsOfObjs(array:Array<any>, filtro, searchKeys){
    let results = [];
    array.filter((objGlobal)=>{
      let isMatch = false;
      let objectGlobalKeys = Object.keys(objGlobal);

      for(let i = 0; i < objectGlobalKeys.length; i ++){
        var objLocal = objGlobal[objectGlobalKeys[i]];
        var localObjectKeys = Object.keys(objLocal);
        for (let j = 0; j < localObjectKeys.length; j ++){
          var valueInLocalObj = objLocal[localObjectKeys[j]];
          for(let k = 0; k < searchKeys.length; k ++){
            let searchKey = searchKeys[k];
            if(searchKey == localObjectKeys[j]){
              if(valueInLocalObj.toString().toLowerCase().search(filtro.toString().toLowerCase()) != - 1){
                isMatch = true;
              }
            }
          }
        }
      }
      if(isMatch){
        results.push(objGlobal);
      }
    });

    return results;
  }

}
