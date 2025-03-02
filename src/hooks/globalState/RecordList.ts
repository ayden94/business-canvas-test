import { create } from 'caro-kann';
import { persist, reducer } from 'caro-kann/middleware';
import { Record } from '../../types/Record';

class RecordListStoreFactory {
  private STORAGE_TYPE: 'in-memory' | 'local-storage' = import.meta.env.VITE_STORAGE;

  private reducer = (
    store: Record[],
    {
      type,
      payload,
    }:
      | { type: 'patch' | 'add'; payload: Record | undefined }
      | { type: 'delete'; payload: Pick<Record, 'key'> },
  ) => {
    switch (type) {
      case 'patch':
        if (!payload) return store;
        return store.map((record) =>
          record.key === payload.key ? { ...record, ...payload } : record,
        );

      case 'add':
        if (!payload) return store;
        return [...store, payload];

      case 'delete':
        return store.filter((record) => record.key !== payload.key);

      default:
        return store;
    }
  };

  generate = (initValue: Record[]) => {
    switch (this.STORAGE_TYPE) {
      case 'in-memory':
        return create(reducer(this.reducer, initValue));

      case 'local-storage':
        return create(reducer(this.reducer, persist(initValue, { local: 'recordList' })));

      default:
        throw new Error('Invalid STORAGE_TYPE');
    }
  };
}

export const useRecordListStore = new RecordListStoreFactory().generate([
  {
    key: crypto.randomUUID(),
    이름: 'John Doe',
    주소: '서울 강남구',
    메모: '외국인',
    가입일: '2024-10-02',
    직업: '개발자',
    ['이메일 수신 동의']: true,
  },
  {
    key: crypto.randomUUID(),
    이름: 'Foo Bar',
    주소: '서울 서초구',
    메모: '한국인',
    가입일: '2024-10-01',
    직업: 'PO',
    ['이메일 수신 동의']: false,
  },
]);
