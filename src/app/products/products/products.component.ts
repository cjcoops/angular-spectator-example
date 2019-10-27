import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { Observable, combineLatest } from 'rxjs';
import { Product } from '../products.model';
import { FormControl } from '@angular/forms';
import { switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  search = new FormControl();
  sortControl = new FormControl('title');

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    // make http request to get a list of products
    this.productsService.load().subscribe();

    // observable of the loading state
    this.loading$ = this.productsService.loading$;

    // observable of the products list
    // filtered by the search term and sorted by the sort control
    this.products$ = combineLatest(
      this.search.valueChanges.pipe(startWith('')),
      this.sortControl.valueChanges.pipe(startWith('title'))
    ).pipe(
      switchMap(([term, sortBy]) => {
        return this.productsService.getProducts(term, sortBy);
      })
    );
  }
}
