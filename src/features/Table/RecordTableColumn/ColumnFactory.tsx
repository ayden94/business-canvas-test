import { Key, ReactElement } from 'react';
import { Record } from '../../../types/Record';
import { MenuProps, Checkbox } from 'antd';
import DialogRecordFormSlot from '../../../components/Dialog/DialogSlot/DialogRecordFormSlot';
import { DialogStore } from '../../../components/Dialog/DialogStore';
import KebabMenu from '../../../components/Kebab';
import { useRecordListStore } from '../../../hooks/globalState/RecordList';
import { tableFilterDropdown } from '../TableFilterDropdown';

interface IColumnConfig {
  title: string;
  dataIndex: string;
  width?: number;
  filters?: { text: string; value: string }[];
  onFilter?: (value: boolean | Key, record: Record) => boolean;
  render?: (value: string, record: Record, index: number) => ReactElement;
  filterDropdown?: any;
}

interface Column {
  exec(key: string, records: Record[]): IColumnConfig;
}

export class ColumnFactory {
  private columnMap: Map<string, new () => Column> = new Map([
    ['이메일 수신 동의', EmailAgreementColumn],
    ['레코드 수정 버튼', RecordEditKebabColumn],
  ]);

  createColumn(key: keyof Record, records: Record[]): IColumnConfig {
    const ColumnClass = this.columnMap.get(key);

    if (ColumnClass) {
      return new ColumnClass().exec(key, records);
    } else {
      return new BasicColumn().exec(key, records);
    }
  }
}

class BasicColumn implements Column {
  exec(key: keyof Record, records: Record[]): IColumnConfig {
    return {
      title: key,
      dataIndex: key,
      filterDropdown: tableFilterDropdown(records, key),
      onFilter: (value: boolean | Key, record: Record) =>
        String(record[key as keyof Record]).includes(value as string),
    };
  }
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
    (_: string, record: Record) => (e) => {
      if (e.key === '수정') {
        DialogStore.store = {
          component: DialogRecordFormSlot,
          props: { title: '회원 정보 수정', type: 'patch', initValue: record },
        };
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
              className="w-180"
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
  exec(key: keyof Record, records: Record[]): IColumnConfig {
    return {
      title: key,
      dataIndex: key,
      width: 150,
      filterDropdown: tableFilterDropdown(records, key),
      onFilter: (value: boolean | Key, record: Record) =>
        String(record[key as keyof Record]).includes(value as string),
      render: (text) => <Checkbox checked={text as unknown as boolean} />,
    };
  }
}
