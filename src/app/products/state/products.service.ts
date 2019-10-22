import { Injectable } from '@angular/core';
import { ProductsStore } from './products.store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { cacheable } from '@datorama/akita';
import { DataService } from '../products/data.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(
    private productsStore: ProductsStore,
    private dataService: DataService
  ) {}

  get(): Observable<void> {
    const request = this.dataService
      .get()
      .pipe(map(response => this.productsStore.set(response)));

    return cacheable(this.productsStore, request);
  }
}
