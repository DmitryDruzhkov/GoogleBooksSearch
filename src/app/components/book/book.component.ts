import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Book } from 'src/app/models';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
  @Input() book: Book;
  @Output() changeFavorite: EventEmitter<void> = new EventEmitter();

  toggleBook(event: MatCheckboxChange): void {
    this.book.checked = event.checked;
    this.changeFavorite.emit();
  }
}
