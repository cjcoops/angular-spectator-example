import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from './products/data.service';
import { Product } from './products.model';

export interface ProductsState {
  products: Product[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private dataService: DataService) {}

  private subject = new BehaviorSubject<ProductsState>({
    products: null,
    loading: true
  });

  products$ = this.subject.asObservable().pipe(map(state => state.products));
  loading$ = this.subject.asObservable().pipe(map(state => state.loading));

  load(): Observable<void> {
    const request = this.dataService
      .get()
      .pipe(
        map(response =>
          this.subject.next({ products: response, loading: false })
        )
      );

    return this.subject.getValue().products ? of() : request;
  }

  getProducts(term: string, sortBy: 'title' | 'price') {
    const sortByFunction = (a: Product, b: Product) => {
      return sortBy === 'title'
        ? a.title.localeCompare(b.title)
        : a.price - b.price;
    };

    const filterFunction = (product: Product) =>
      !term || product.title.toLowerCase().includes(term.toLowerCase());

    return this.products$.pipe(
      map(products => products.filter(filterFunction).sort(sortByFunction))
    );
  }
}
