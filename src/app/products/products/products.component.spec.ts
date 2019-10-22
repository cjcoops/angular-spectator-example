import { DataService } from './data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from './product/product.component';
import { ProductsComponent } from './products.component';
import {
  Spectator,
  createComponentFactory,
  byText,
  byTestId,
  byPlaceholder,
  byLabel
} from '@ngneat/spectator';
import { timer, of } from 'rxjs';
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
          { id: 1, title: 'VueJS', price: 45 },
          {
            id: 2,
            title: 'React',
            price: 50,
            description: 'Build user interfaces'
          }
        ])
      )
    );

    spectator.detectChanges();
    expect(spectator.query(byTestId('loader'))).toExist();

    tick(100);
    spectator.detectChanges();

    expect(dataService.get).toHaveBeenCalled();
    expect(dataService.get).toHaveBeenCalledTimes(1);
    expect(spectator.query(byTestId('loader'))).not.toExist();
    expect(spectator.query(byText('React'))).toExist();
    expect(spectator.query(byText('50$'))).toExist();
    expect(spectator.query(byText('Build user interfaces'))).toExist();
    tick();
  }));

  it('should filter the products based on the search term', () => {
    const dataService = spectator.get(DataService);

    dataService.get.andCallFake(() =>
      of([
        { id: 1, title: 'VueJS', price: 45 },
        {
          id: 2,
          title: 'React',
          price: 50,
          description: 'Build user interfaces'
        }
      ])
    );

    spectator.detectChanges();

    expect(spectator.query(byText('React'))).toExist();
    expect(spectator.query(byText('VueJS'))).toExist();

    spectator.typeInElement(
      'v',
      spectator.query(byPlaceholder('Search Product..'))
    );

    expect(spectator.query(byText('React'))).not.toExist();
    expect(spectator.query(byText('VueJS'))).toExist();
  });

  it('should sort the products based on the sort control', () => {
    const mockData = [
      { id: 1, title: 'VueJS', price: 45 },
      {
        id: 2,
        title: 'React',
        price: 50,
        description: 'Build user interfaces'
      }
    ];

    const dataService = spectator.get(DataService);

    dataService.get.andCallFake(() => of(mockData));

    spectator.detectChanges();

    const renderedTitles = spectator.queryAll('.product-title');

    expect(renderedTitles[0]).toHaveText('React');
    expect(renderedTitles[1]).toHaveText('VueJS');

    const select = spectator.query(byLabel('Sort by')) as HTMLSelectElement;
    spectator.selectOption(select, 'price');

    const renderedTitlesAfterSelect = spectator.queryAll('.product-title');

    expect(select).toHaveSelectedOptions('price');
    expect(renderedTitlesAfterSelect[0]).toHaveText('VueJS');
    expect(renderedTitlesAfterSelect[1]).toHaveText('React');
  });
});

// const setup = () => {
//   spectator = createComponent();

//   const dataService = spectator.get<DataService>(DataService);

//   const {
//     detectChanges,
//     query,
//     typeInElement,
//     selectOption,
//     queryAll
//   } = spectator;

//   const mockProducts = [
//     { id: 1, title: 'VueJS', price: 45 },
//     {
//       id: 2,
//       title: 'React',
//       price: 50,
//       description: 'Build user interfaces'
//     }
//   ];

//   return {
//     detectChanges,
//     query,
//     queryAll,
//     typeInElement,
//     dataService,
//     selectOption,
//     mockProducts
//   };
// };
