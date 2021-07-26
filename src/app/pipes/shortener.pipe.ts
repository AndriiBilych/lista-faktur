import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortener'
})
export class ShortenerPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {

    return value.length > 50 ? `${value.substring(0, 50)}...` : value;
  }

}
