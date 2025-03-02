import { JSX } from 'react';

type StoreItem = {
  component: (props: any) => JSX.Element;
  props: any;
};

export class DialogStore {
  static _store: StoreItem | undefined;
  static listeners: Function[] = [];

  static get store() {
    return this._store;
  }

  static set store(value: StoreItem | undefined) {
    if (value !== undefined && this._store !== undefined) return;

    this._store = value;
    this.listeners.forEach((listener) => listener());
  }

  static addListener(listener: Function) {
    this.listeners.push(listener);
  }

  static removeListener(listener: Function) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }
}
