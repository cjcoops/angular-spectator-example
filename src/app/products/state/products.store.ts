import { EntityState, StoreConfig, EntityStore } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Product } from './products.model';

export interface ProductsState extends EntityState<Product> {}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'products' })
export class ProductsStore extends EntityStore<ProductsState> {
  constructor() {
    super();
  }
}
