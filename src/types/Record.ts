import { SELECT_JOB_OPTIONS } from '../constants/SELECT_JOB_OPTIONS';

export type Record = {
  key: `${string}-${string}-${string}-${string}-${string}`;
  이름: string;
  주소?: string;
  메모?: string;
  가입일: string;
  직업?: (typeof SELECT_JOB_OPTIONS)[number];
  '이메일 수신 동의'?: boolean;
};
