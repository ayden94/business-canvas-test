import { Button, Checkbox, TableProps } from 'antd';
import { Label } from '../types/Label';
import { Record } from '../types/Record';
import { Key } from 'react';

export const getColumnByRecords = <T extends Array<Record>>(
  records: T,
): TableProps<Record>['columns'] => {
  const columns: TableProps<Record>['columns'] = [];

  for (const [key] of Object.entries(records[0])) {
    if (key === 'key') continue;

    columns.push({
      title: key,
      dataIndex: key,
      filters: records.map((record) => ({
        text: record[key as Label],
        value: record[key as Label] as boolean | Key,
      })),
      onFilter: (value: boolean | Key, record: Record) => record['이름'].includes(value as string),
      render: (text) =>
        key === '이메일 수신 동의' ? <Checkbox checked={text} /> : <span>{text}</span>,
    });
  }

  columns.push({
    title: '',
    className: 'text-bold',
    dataIndex: 'id',
    render: (text: string) => <Button type="primary">{text}</Button>,
  });

  return columns;
};
