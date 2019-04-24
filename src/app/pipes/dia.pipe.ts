import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dia'
})
export class DiaPipe implements PipeTransform {
  dias = {
    1:"Lunes",
    2:"Martes",
    3:"Miercoles",
    4:"Jueves",
    5:"Viernes",
    6:"Sabado",
    7:"Domingo"
  };

  transform(value: any): string {
    return this.dias[value];
  }

}
