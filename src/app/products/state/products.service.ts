import { Injectable } from '@angular/core';
import { ProductsStore } from './products.store';
import { timer, Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { products } from '../products.mocks';
import { cacheable } from '@datorama/akita';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private productsStore: ProductsStore) {}

  get(): Observable<void> {
    const request = timer(500).pipe(
      mapTo(products),
      map(response => this.productsStore.set(response))
    );

    return cacheable(this.productsStore, request);
  }
}
