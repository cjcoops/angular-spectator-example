import { ProductsStore, ProductsState } from './products.store';
import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Product } from './products.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsQuery extends QueryEntity<ProductsState> {
  constructor(protected store: ProductsStore) {
    super(store);
  }

  getProducts(term: string, sortBy: keyof Product) {
    return this.selectAll({
      sortBy,
      filterBy: entity => entity.title.toLowerCase().includes(term)
    });
  }
}
