import { JSX } from 'react';

export class DialogStore {
  static _store: { component: (props: any) => JSX.Element; props: any } | undefined;
  static listeners: Function[] = [];

  static get store() {
    return this._store;
  }

  static set store(value: { component: (props: any) => JSX.Element; props: any } | undefined) {
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
