export interface Book {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  authors: string[];
  publishedDate: string;
  publisher: string;
  language: Languages;
  pageCount: number;
  checked: boolean;
}

export enum Languages {
  'RU' = 'ru',
  'EN' = 'en'
}

export const LanguageDescription = {
  [Languages.RU]: 'Русский',
  [Languages.EN]: 'Английский',
};

export const StorageSearchKey = 'GoogleBook_Search';
export const StorageFavoriteKey = 'GoogleBook_Favorite';
