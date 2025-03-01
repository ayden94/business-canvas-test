import { useRecordListStore } from './hooks/globalState/RecordList';
import { getColumnByRecords } from './constants/getColumnByRecords';
import { FaPlus } from '@react-icons/all-files/fa/FaPlus';
import { Button } from 'antd';
import { DialogStore } from './components/Dialog/DialogStore';
import Dialog from './components/Dialog/Dialog';
import RecordForm from './components/Form/RecordForm';
import Table from './components/Table';
import { useState } from 'react';
import { Record } from './types/Record';

export default function App() {
  const [data] = useRecordListStore();

  return (
    <>
      <Table
        title={
          <div className="flex justify-between align-middle">
            <span className="flex items-center text-[16px]/[22px] font-semibold">회원 목록</span>
            <Button type="primary" onClick={() => (DialogStore.store = RFC)}>
              <FaPlus />
              추가
            </Button>
          </div>
        }
        data={data}
        columns={getColumnByRecords(data)}
      />
    </>
  );
}

function RFC() {
  const [_, dispatcher] = useRecordListStore();
  const [formValues, setFormValues] = useState<Record>();

  return (
    <>
      <Dialog.Title title="레코드 추가" />
      <RecordForm setFormValues={setFormValues} />
      <Dialog.Footer
        onClick={() => {
          dispatcher({ type: 'add', payload: formValues });
        }}
      >
        저장
      </Dialog.Footer>
    </>
  );
}
