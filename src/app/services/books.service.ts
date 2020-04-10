import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private booksStore: BehaviorSubject<Book[]> = new BehaviorSubject([]);

  addBooks(books: Book[]): void {
    this.booksStore.next([
      ...this.currentBooks(),
      ...books
    ]);
  }

  books(): Observable<Book[]> {
    return this.booksStore.asObservable();
  }

  currentBooks(): Book[] {
    return this.booksStore.getValue();
  }

  resetResults(): void {
    this.booksStore.next([]);
  }
}
