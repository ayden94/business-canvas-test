import { TableProps } from 'antd';
import { Label } from '../../../types/Label';
import { Record } from '../../../types/Record';
import { ColumnFactory } from './ColumnFactory';

export const getColumnByRecords = <T extends Array<Record>>(
  records: T,
): TableProps<Record>['columns'] => {
  const columns: TableProps<Record>['columns'] = [];

  // 추후 전역 상태로 분리 가능
  const ColumnList = [
    '이름',
    '주소',
    '메모',
    '가입일',
    '직업',
    '이메일 수신 동의',
    '레코드 수정 버튼',
  ];

  for (const key of ColumnList) {
    columns.push(new ColumnFactory().createColumn(key as Label, records));
  }

  return columns;
};
