import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { products } from '../products.mocks';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  get() {
    return timer(500).pipe(mapTo(products));
  }
}
