// import { ReactNode } from 'react';

import { JSX } from 'react';

export class DialogStore {
  static _store: (() => JSX.Element) | undefined;
  static listeners: Function[] = [];

  static get store() {
    return this._store;
  }

  static set store(value: (() => JSX.Element) | undefined) {
    if (value !== undefined && this._store !== undefined) return;

    this._store = value;
    this.notifyListeners();
  }

  static addListener(listener: Function) {
    this.listeners.push(listener);
  }

  static removeListener(listener: Function) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  static notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
}
