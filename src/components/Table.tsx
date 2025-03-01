import { Table as TableAnt, TableProps } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import { ReactElement, useState } from 'react';

export default function Table<T>({
  data,
  columns,
  title,
}: {
  data: T[];
  columns: TableProps<T>['columns'];
  title?: ReactElement;
}) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('선택된 키:', newSelectedRowKeys); // 디버깅
    if (newSelectedRowKeys) {
      setSelectedRowKeys(newSelectedRowKeys);
    }
  };

  const rowSelection: TableRowSelection<T> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <TableAnt<T>
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data}
      pagination={false}
      title={() => title}
    />
  );
}
