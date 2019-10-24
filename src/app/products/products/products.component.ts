import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../state/products.service';
import { Observable, combineLatest } from 'rxjs';
import { Product } from '../state/products.model';
import { FormControl } from '@angular/forms';
import { ProductsQuery } from '../state/products.query';
import { switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  search = new FormControl();
  sortControl = new FormControl('title');

  constructor(
    private productsService: ProductsService,
    private productsQuery: ProductsQuery
  ) {}

  ngOnInit() {
    // make http request to get a list of products
    this.productsService.get().subscribe();

    // observable of the loading state
    this.loading$ = this.productsQuery.selectLoading();

    // observable of the products list
    // filtered by the search term and sorted by the sort control
    this.products$ = combineLatest(
      this.search.valueChanges.pipe(startWith('')),
      this.sortControl.valueChanges.pipe(startWith('title'))
    ).pipe(
      switchMap(([term, sortBy]) => {
        return this.productsQuery.getProducts(term, sortBy as keyof Product);
      })
    );
  }
}
