import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pirority'
})
export class PirorityPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return value == 1 ? 'Low' : (value == 2 ? 'Medium' : 'High');
  }

}
