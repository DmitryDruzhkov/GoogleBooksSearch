import { Injectable, OnDestroy } from '@angular/core';
import { Book, LanguageDescription, StorageSearchKey } from '../models';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { StorageService } from './storage.service';
import { takeUntil, filter, tap, switchMap, catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { BooksService } from './books.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService implements OnDestroy {

  private inputEvent: BehaviorSubject<string> = new BehaviorSubject('');
  private onDestroy: Subject<null> = new Subject();
  searchText = '';

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private booksService: BooksService,
  ) { }

  initSearhValue(): string {
    this.searchText = this.storage.getValue(StorageSearchKey) || '';
    return this.searchText;
  }

  searchBooks(): void {
    this.inputEvent.pipe(
      takeUntil(this.onDestroy),
      filter(Boolean),
      tap((searchText: string) => this.storage.setValue(StorageSearchKey, searchText)),
      switchMap((input: string) => this.api.getVideoList(input).pipe(
        catchError(err => of([])),
        map(result => result.items?.map(item => ({
            id: item.id,
            title: item.volumeInfo.title,
            description: item.volumeInfo.description,
            thumbnail: item.volumeInfo.imageLinks?.thumbnail || '',
            authors: item.volumeInfo.authors,
            publishedDate: item.volumeInfo.publishedDate,
            publisher: item.volumeInfo.publisher,
            pageCount: item.volumeInfo.pageCount,
            language: LanguageDescription[item.volumeInfo.language],
            checked: false
          })) || []
        )))
    ).subscribe((books: Book[]) => {
      this.booksService.addBooks(books);
    });
  }

  setInputEvent(searchText: string): void {
    if (searchText !== undefined) {
      if (this.searchText !== searchText) {
        this.booksService.resetResults();
      }

      this.searchText = searchText;
    }

    this.inputEvent.next(this.searchText);
  }

  ngOnDestroy() {
    this.onDestroy.next(null);
    this.onDestroy.complete();
  }
}
