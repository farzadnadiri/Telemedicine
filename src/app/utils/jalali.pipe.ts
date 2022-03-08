import { Pipe, PipeTransform } from '@angular/core';
import moment from 'jalali-moment';

@Pipe({
  name: 'jalali',
})
export class JalaliPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let MomentDate = moment(new Date(value), 'YYYY/MM/DD HH:MM');
    return MomentDate.locale('fa').format('YYYY/M/D HH:MM');
  }
}
