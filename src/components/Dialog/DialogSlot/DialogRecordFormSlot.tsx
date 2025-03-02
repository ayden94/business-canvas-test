import { useState } from 'react';
import Dialog from '../Dialog';
import RecordForm from '../../Form/RecordForm';
import { useRecordListStore } from '../../../hooks/globalState/RecordList';
import { Record } from '../../../types/Record';

export default function DialogRecordFormSlot({
  title,
  type,
  initValue,
}: {
  title: string;
  type: 'patch' | 'add';
  initValue?: Record;
}) {
  const [_, dispatcher] = useRecordListStore();
  const [formValues, setFormValues] = useState<Record>();

  return (
    <>
      <Dialog.Title title={title} />
      <RecordForm setFormValues={setFormValues} initValue={initValue} />
      <Dialog.Footer
        onClick={() => {
          dispatcher({ type: type, payload: formValues });
        }}
      >
        저장
      </Dialog.Footer>
    </>
  );
}
