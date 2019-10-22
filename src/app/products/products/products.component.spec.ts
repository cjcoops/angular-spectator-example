import { DataService } from './data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from './product/product.component';
import { ProductsComponent } from './products.component';
import {
  Spectator,
  createComponentFactory,
  mockProvider
} from '@ngneat/spectator';
import { of } from 'rxjs';

describe('ProductsComponent', () => {
  let spectator: Spectator<ProductsComponent>;
  const createComponent = createComponentFactory({
    component: ProductsComponent,
    declarations: [ProductComponent],
    imports: [ReactiveFormsModule],
    providers: [
      mockProvider(DataService, {
        get: () => of([])
      })
    ],
    detectChanges: false
  });

  beforeEach(() => (spectator = createComponent()));

  it('should load a list of products', () => {
    spectator.detectChanges();
    expect(spectator.query('.progress')).toBeTruthy();
  });
});
