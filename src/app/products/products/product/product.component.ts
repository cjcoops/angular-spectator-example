import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  Input
} from '@angular/core';
import { Product } from '../../products.model';

@Component({
  selector: 'app-product',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: `./product.component.html`
})
export class ProductComponent {
  @Input() product: Product;
  @Output() add = new EventEmitter<Product>();
  @Output() subtract = new EventEmitter<Product>();
}
