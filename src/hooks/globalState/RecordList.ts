import { create } from 'caro-kann';
import { persist } from 'caro-kann/middleware';
import { Record } from '../../types/Record';

class RecordListStoreFactory {
  apiUrl: string = import.meta.env.STORAGE;

  generate(initValue: Record[]) {
    if (this.apiUrl === 'in-memory') {
      return create(initValue);
    } else {
      return create(persist(initValue, { local: 'recordList' }));
    }
  }
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
