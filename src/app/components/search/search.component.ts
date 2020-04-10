import { Component, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements AfterViewInit {
  @Input() set defaultValue(value: string) {
    this.value = value;
  }
  @Output() inputEvent: EventEmitter<string> = new EventEmitter();

  @ViewChild('searchInput') input: ElementRef;

  value: string;

  ngAfterViewInit(): void {
    fromEvent(this.input.nativeElement, 'input')
    .pipe(
        map((event: KeyboardEvent) => {
          return event.target.value;
        }),
        startWith(this.value),
        debounceTime(150),
        distinctUntilChanged(),
    )
    .subscribe((inputValue: string) => {
      this.inputEvent.next(inputValue);
    });
  }
}
