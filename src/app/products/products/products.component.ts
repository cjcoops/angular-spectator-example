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
    this.productsService.get().subscribe();
    this.loading$ = this.productsQuery.selectLoading();

    this.products$ = combineLatest(
      this.search.valueChanges.pipe(startWith('')),
      this.sortControl.valueChanges.pipe(startWith('title'))
    ).pipe(
      switchMap(([term, sortBy]) =>
        this.productsQuery.getProducts(term, sortBy as keyof Product)
      )
    );
  }
}
