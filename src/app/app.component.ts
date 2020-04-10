import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Book, StorageFavoriteKey } from './models';
import { StorageService } from './services/storage.service';
import { BooksService } from './services/books.service';
import { FavoriteService } from './services/favorite.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  showSearchResult: BehaviorSubject<boolean> = new BehaviorSubject(true);
  books: Observable<Book[]>;
  searchText = '';

  constructor(
    private searach: SearchService,
    private storage: StorageService,
    private booksService: BooksService,
    private favoriteService: FavoriteService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.books = combineLatest([
      this.booksService.books(),
      this.favoriteService.books(),
      this.showSearchResult
    ]).pipe(
      map(([searchBooks, favoriteBooks, showSearchResult]: [Book[], Book[], boolean]) => {
        this.cdRef.detectChanges();
        if (showSearchResult) {
          return searchBooks;
        } else {
          return favoriteBooks;
        }
      })
    );
  }

  ngOnInit(): void {
    this.getFavoriteBooks();
    this.searchText = this.searach.initSearhValue();
    this.searach.searchBooks();
  }

  searchBooks(searchText: string): void {
    this.searach.setInputEvent(searchText);
  }

  getFavoriteBooks(): void {
    const favoriteBooks = this.storage.getValue(StorageFavoriteKey);
    if(!favoriteBooks) return;
    this.favoriteService.addBooks(JSON.parse(favoriteBooks));
  }

  toggleBook(): void {
    const favoriteBooks: Book[] = this.booksService.currentBooks().filter(book => book.checked);
    this.storage.setValue(StorageFavoriteKey, JSON.stringify(favoriteBooks));
  }

  changeResult(event: MatSlideToggleChange): void {
    this.showSearchResult.next(event.checked);
  }
}
