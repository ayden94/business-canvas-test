import { Checkbox, MenuProps, TableProps } from 'antd';
import { Label } from '../types/Label';
import { Record } from '../types/Record';
import { Key, ReactElement } from 'react';
import { useRecordListStore } from '../hooks/globalState/RecordList';
import { DialogStore } from '../components/Dialog/DialogStore';
import KebabMenu from '../components/Kebab';
import Dialog from '../components/Dialog/Dialog';
import RecordForm from '../components/Form/RecordForm';

export const getColumnByRecords = <T extends Array<Record>>(
  records: T,
): TableProps<Record>['columns'] => {
  const columns: TableProps<Record>['columns'] = [];

  // 추후 전역 상태로 분리
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

class ColumnFactory {
  private columnMap: Map<string, new () => Column> = new Map([
    ['이메일 수신 동의', EmailAgreementColumn],
    ['레코드 수정 버튼', RecordEditKebabColumn],
  ]);

  createColumn(key: string, records: Record[]): IColumnConfig {
    const ColumnClass = this.columnMap.get(key);

    if (ColumnClass) {
      return new ColumnClass().exec(key, records);
    } else {
      return new BasicColumn().exec(key, records);
    }
  }
}

interface IColumnConfig {
  title: string;
  dataIndex: string;
  width?: number;
  filters?: { text: string; value: string }[];
  onFilter?: (value: boolean | Key, record: Record) => boolean;
  render?: (value: string, record: Record, index: number) => ReactElement;
}

interface Column {
  exec(key: string, records: Record[]): IColumnConfig;
}

class RecordEditKebabColumn implements Column {
  private useRecordListStore = useRecordListStore();
  private items: MenuProps['items'] = [
    {
      key: '수정',
      label: '수정',
    },
    {
      key: '삭제',
      label: '삭제',
      danger: true,
    },
  ];
  private handleRecordEditMenuClick: (value: string, record: Record) => MenuProps['onClick'] =
    (value: string, record: Record) => (e) => {
      if (e.key === '수정') {
        DialogStore.store = (
          <>
            <Dialog.Title title="레코드 추가" />
            <RecordForm initValue={record} />
            <Dialog.Footer<Record>
              onClick={(data) => this.useRecordListStore[1]({ type: 'patch', payload: data })}
            >
              저장
            </Dialog.Footer>
          </>
        );
      } else if (e.key === '삭제') {
        if (confirm('정말 삭제하시겠습니까?')) {
          this.useRecordListStore[1]({ type: 'delete', payload: { key: record.key } });
        }
      }
    };

  exec(): IColumnConfig {
    return {
      title: '',
      dataIndex: 'key',
      width: 48,
      render: (value: string, record: Record) => {
        return (
          <>
            <KebabMenu
              items={this.items}
              handleMenuClick={this.handleRecordEditMenuClick(value, record)}
            />
          </>
        );
      },
    };
  }
}

class EmailAgreementColumn implements Column {
  exec(key: string, records: Record[]): IColumnConfig {
    return {
      title: key,
      dataIndex: key,
      filters: records.map((record: Record) => ({
        text: String(record[key as keyof Record]),
        value: String(record[key as keyof Record]),
      })),
      onFilter: (value: boolean | Key, record: Record) => record['이름'].includes(value as string),
      render: (text) => <Checkbox checked={text as unknown as boolean} />,
    };
  }
}

class BasicColumn implements Column {
  exec(key: string, records: Record[]): IColumnConfig {
    return {
      title: key,
      dataIndex: key,
      filters: records.map((record: Record) => ({
        text: String(record[key as keyof Record]),
        value: String(record[key as keyof Record]),
      })),
      onFilter: (value: boolean | Key, record: Record) =>
        String(record[key as keyof Record]).includes(value as string),
    };
  }
}
