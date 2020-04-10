import { Component, Input, ChangeDetectionStrategy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from 'src/app/models';
import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { filter, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements AfterViewInit {
  @Input() books: Observable<Book[]>;
  @Output() changeFavorite: EventEmitter<void> = new EventEmitter();
  @Output() loadBooks: EventEmitter<void> = new EventEmitter();

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  constructor(
    private scrollDispatcher: ScrollDispatcher,
  ) {}

  ngAfterViewInit(): void {
    this.scrollDispatcher.scrolled().pipe(
      debounceTime(100),
      filter(() => this.virtualScroll.measureScrollOffset('bottom') === 0)
    ).subscribe(() => {
      this.loadBooks.emit();
    });

    this.books.subscribe((books: Book[]) => {
      console.log(books);
    });
  }

  trackByFn(index, book: Book) {
    return book.id;
  }

  toggleBook(): void {
    this.changeFavorite.emit();
  }
}
