import { Prettify } from '@/types/util';

export type TextTypes = 'text' | 'textarea' | 'search' | 'tel' | 'url' | 'email' | 'password';
export type NumberTypes = 'number' | 'month' | 'week';
export type BooleanTypes = 'radio' | 'checkbox';
export type DateTypes = 'date' | 'time' | 'datetime-local';

export type InputType = Prettify<BooleanTypes | TextTypes | NumberTypes | DateTypes | 'color' | 'hidden' | 'image'>;
