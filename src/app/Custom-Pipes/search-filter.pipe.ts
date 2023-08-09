import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(data: any[], searchTerm: string, columns: string[]): any[] {
    if (!data || !searchTerm || !columns || columns.length === 0) {
      return data;
    }

    searchTerm = searchTerm.toLowerCase();
    return data.filter(item => this.itemMatchesSearchTerm(item, searchTerm, columns));
  }

  private itemMatchesSearchTerm(item: any, searchTerm: string, columns: string[]): boolean {
    for (const column of columns) {
      if(item[column] !=null && item[column] !=''){
        if (item.hasOwnProperty(column) && item[column].toString().toLowerCase().includes(searchTerm)) {
          return true;
        }
      }
    }
    return false;
  }
}