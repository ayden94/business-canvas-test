import { FaPlus } from '@react-icons/all-files/fa/FaPlus';
import { Button } from 'antd';
import { DialogStore } from '../components/Dialog/DialogStore';
import { useRecordListStore } from '../hooks/globalState/RecordList';
import DialogRecordFormSlot from '../components/Dialog/DialogSlot/DialogRecordFormSlot';
import Table from '../components/Table/Table';
import { getColumnByRecords } from '../features/Table/RecordTableColumn/getColumnByRecords';

export default function RecordTable() {
  const [recordList] = useRecordListStore();

  return (
    <Table
      title={
        <div className="flex justify-between align-middle">
          <span className="flex items-center text-[16px]/[22px] font-semibold">회원 목록</span>
          <Button
            type="primary"
            onClick={() =>
              (DialogStore.store = {
                component: DialogRecordFormSlot,
                props: { title: '회원 생성', type: 'add' },
              })
            }
          >
            <FaPlus />
            추가
          </Button>
        </div>
      }
      data={recordList}
      columns={getColumnByRecords(recordList)}
    />
  );
}
