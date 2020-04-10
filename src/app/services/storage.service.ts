import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setValue(key, value): void {
    localStorage.setItem(key, value);
  }

  getValue(key): string | null {
    return localStorage.getItem(key);
  }
}
