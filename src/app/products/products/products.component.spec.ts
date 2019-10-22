import { DataService } from './data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from './product/product.component';
import { ProductsComponent } from './products.component';
import {
  Spectator,
  createComponentFactory,
  byText,
  byTestId
} from '@ngneat/spectator';
import { of, timer } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';
import { mapTo } from 'rxjs/operators';

describe('ProductsComponent', () => {
  let spectator: Spectator<ProductsComponent>;
  const createComponent = createComponentFactory({
    component: ProductsComponent,
    declarations: [ProductComponent],
    imports: [ReactiveFormsModule],
    mocks: [DataService],
    detectChanges: false
  });

  beforeEach(() => (spectator = createComponent()));

  it('should load a list of products', fakeAsync(() => {
    const dataService = spectator.get(DataService);

    dataService.get.andCallFake(() =>
      timer(100).pipe(
        mapTo([
          {
            id: 1,
            title: 'React',
            price: 50,
            description: 'Build user interfaces'
          },
          { id: 2, title: 'VueJS', price: 45 }
        ])
      )
    );

    spectator.detectChanges();
    expect(spectator.query(byTestId('loader'))).toExist();

    tick(100);
    spectator.detectChanges();

    expect(spectator.query(byTestId('loader'))).not.toExist();
    expect(spectator.query(byText('React'))).toExist();
    expect(spectator.query(byText('50$'))).toExist();
    expect(spectator.query(byText('Build user interfaces'))).toExist();
    tick();
  }));
});
