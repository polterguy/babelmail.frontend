/*
 * Automatically generated by Magic
 */

/*
 * Automatically generated by Magic
 */

// Angular imports.
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
} from 'rxjs/operators';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';

// Application specific imports.
import { IREntity } from '@app/services/interfaces/crud-interfaces';

/**
 * Autocomplete filtering component allowing you to have an autocomplete
 * during filtering of items in your grids, for items where you have a foreign key,
 * which is a lookup into another database table. Usage would be
 * something like the following in your HTML.

          <app-magic-filter
            [model]="filter"
            field="horse_id.eq"
            key="id"
            value="name"
            placeholder="Horse"
            (change)="getData()"
            [getItems]="httpService.horses">
          </app-magic-filter>

 * The above would create an autocomplete filter component for you,
 * allowing you to select from a popdown, declared in a database table,
 * instead of having user to manually type in the correct key.
 *
 * In the above example the main table has a field called 'horse_id',
 * which is a foreign key leading into the 'horses' 'id' column,
 * and you want to display the 'name' field to the end user.
 * 
 * The (change) part is an output emitter, invoked as the currently selected
 * value has been changed, and needs to invoke the method responsible for
 * actually retrieving items for your main databound grid.
 */
@Component({
  selector: 'app-magic-filter',
  templateUrl: './magic-filter.component.html',
  styleUrls: ['./magic-filter.component.scss'],
})
export class MagicFilterComponent implements OnInit {
  // Observable for filtering items.
  public filteredOptions: Observable<any[]> = null;

  /**
   * Model you're databinding towards.
   */
  @Input() public model: any;

  /**
   * Field in the model that is databound towards the selected key.
   */
  @Input() public field: string;

  /**
   * Key in the referenced table that the field is changed to as
   * an item is selected.
   */
  @Input() public key: string;

  /**
   * Field in the referenced table that is displayed to the user
   * allowing him to select a specific item.
   */
  @Input() public value: string;

  /**
   * Placeholder value of selector component.
   */
  @Input() public placeholder: string;

  /**
   * Observable callback for component to retrieve items
   * to databound towards from backend HTTP service.
   */
  @Input() public getItems: IREntity;

  /**
   * Callback to invoke once item is changed.
   */
  @Output() public change: EventEmitter<any> = new EventEmitter();

  /**
   * Needed to programmatically set selected value during init if existing item is edited.
   */
  @ViewChild(MatAutocompleteTrigger) matAutocomplete: MatAutocompleteTrigger;

  /**
   * The control wrapping the input field.
   */
  public control = new FormControl();

  /**
   * Contains actual databound items, after having fetched
   * them from the backend.
   */
  public items: any[] = [];

  /**
   * If true, we're fetching items from backend.
   */
  public loading = false;

  /*
   * If false, the control will not fetch items as its value changes.
   */
  private fetch = true;

  /**
   * OnInit implementation.
   */
  public ngOnInit() {
    // Creating our filter observable.
    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.items?.slice()))
    );

    // Checking if model has a value already, at which point we display it by default.
    if (this.model[this.field]) {
      // Wee need to fetch the currently selected item and set the value of our autocomplete.
      this.loading = true;
      this.getItems
        .read({
          [this.key + '.eq']: this.model[this.field],
          limit: 1,
        })
        .subscribe((result: any[]) => {
          // Assigning model.
          this.items = result;
          setTimeout(() => {
            const options = this.matAutocomplete.autocomplete.options.toArray();
            this.fetch = false;
            this.control.setValue(options[0].value);
          }, 1);

          // Making sure we subscribe to changes to input field, such that we can retrieve items from backend.
          this.control.valueChanges
            .pipe(debounceTime(400), distinctUntilChanged())
            .subscribe(() => {
              if (this.fetch) {
                this.model[this.field] = null;
                this.getData();
              }
              this.fetch = true;
            });
          this.loading = false;
        });
    } else {
      // Making sure we subscribe to changes to input field, such that we can retrieve items from backend.
      this.control.valueChanges
        .pipe(debounceTime(400), distinctUntilChanged())
        .subscribe(() => {
          if (this.fetch) {
            this.model[this.field] = null;
            this.getData();
          }
          this.fetch = true;
        });
    }
  }

  /**
   * Invoked when filter control gains focus.
   */
  public focused() {
    // Checking if we already have items, at which point we do nothing.
    if (this.items.length === 0) {
      this.getData();
    }
  }

  /**
   * Returns display text for specified entity.
   *
   * @param entity Entity to display
   */
  public displayFn(entity: any): string {
    return entity && entity[this.value] ? entity[this.value] ?? '' : '';
  }

  /**
   * Invoked when the currently selected item in the autocompleter changes.
   *
   * @param e Event data
   */
  public selectionChanged(e: MatAutocompleteSelectedEvent) {
    // Preventing debounce to fetch data.
    this.fetch = false;

    // Assigning model.
    this.model[this.field] = e.option.value[this.key];

    // Notifying subscribers.
    this.change?.emit();
  }

  /*
   * Private helper methods.
   */

  /*
   * Filter function, returning items matching filtering text to caller.
   */
  private _filter(filter: string): any[] {
    // Making sure we do lower case comparison.
    const filterValue = filter.toLowerCase();
    return this.items.filter(
      (x) => x[this.value]?.toLowerCase()?.includes(filterValue) ?? false
    );
  }

  /*
   * Invoked as control needs new data from backend.
   */
  private getData() {
    // Retrieving items from IREntity instance provided by consumer.
    this.loading = true;
    const filter: any = {
      limit: 25,
    };
    if (this.control.value && this.control.value !== '') {
      filter[this.value + '.like'] = this.control.value;
    }
    this.getItems.read(filter).subscribe((res) => {
      // Assigning model.
      this.items = res || [];
      this.items.sort((lhs, rhs) => {
        if (lhs[this.value] < rhs[this.value]) {
          return -1;
        } else if (lhs[this.value] > rhs[this.value]) {
          return 1;
        }
        return 0;
      });
      this.loading = false;
    });
  }
}