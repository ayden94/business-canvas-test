import { DatePicker, Input, Select, Checkbox } from 'antd';
import { SELECT_JOB_OPTIONS } from '../../constants/SELECT_JOB_OPTIONS';
import Label from '../Label';
import Form from './Form';
import { Record } from '../../types/Record';
import dayjs from 'dayjs';
import { useForm } from 'sicilian/useForm';
import { SicilianProvider, useSicilianContext } from 'sicilian/provider';
import { useDialogFormHandler } from '../../hooks/useHandler/Dialog/useDialogFormHanlder';
import { Dispatch, SetStateAction, useEffect } from 'react';

export default function RecordForm({
  initValue = {
    key: crypto.randomUUID(),
    이름: '',
    주소: '',
    가입일: '',
    직업: SELECT_JOB_OPTIONS[0],
    '이메일 수신 동의': false,
  },
  setFormValues,
}: {
  initValue?: Record;
  setFormValues: Dispatch<SetStateAction<Record | undefined>>;
}) {
  const { register, getValues } = useForm({
    initValue,
  });
  const formValues = getValues();

  useEffect(() => {
    setFormValues(formValues);
  }, [formValues]);

  useDialogFormHandler(!formValues.가입일 || !formValues.이름, formValues);

  return (
    <SicilianProvider value={{ register, name: '이름' }}>
      <Form className="mx-24 mt-10 mb-20 flex w-520 flex-col gap-20">
        <RecordNameInput />
        <RecordAddressInput />
        <RecordMemoInput />
        <RecordJoinDateInput />
        <RecordJobInput />
        <RecordEmailAgreementCheckbox />
      </Form>
    </SicilianProvider>
  );
}

function RecordNameInput() {
  const { register } = useSicilianContext();

  return (
    <div>
      <Label className="flex h-40 items-center" htmlFor="이름" required>
        이름
      </Label>

      <Input {...register({ name: '이름' })} placeholder="이름" />
    </div>
  );
}

function RecordAddressInput() {
  const { register } = useSicilianContext();

  return (
    <div>
      <Label className="flex h-40 items-center" htmlFor="주소">
        주소
      </Label>

      <Input {...register({ name: '주소' })} placeholder="주소" />
    </div>
  );
}

function RecordMemoInput() {
  const { register } = useSicilianContext();

  return (
    <div>
      <Label className="flex h-40 items-center" htmlFor="메모">
        메모
      </Label>

      <Input.TextArea {...register({ name: '메모' })} placeholder="메모" />
    </div>
  );
}

function RecordJoinDateInput() {
  const { register } = useSicilianContext();
  const selectJoinDate = register({ name: '가입일', type: 'date' });

  return (
    <div>
      <Label className="flex h-40 items-center" htmlFor="가입일" required>
        가입일
      </Label>

      <DatePicker
        showToday={false}
        id="가입일"
        placeholder="가입일"
        getPopupContainer={(trigger) => trigger}
        value={selectJoinDate.value ? dayjs(selectJoinDate.value) : null}
        onChange={(value) =>
          selectJoinDate.onChange({
            target: { name: '가입일', value: value ? value.format('YYYY-MM-DD') : '' },
          })
        }
      />
    </div>
  );
}

function RecordJobInput() {
  const { register } = useSicilianContext();
  const selectJob = register({ name: '직업' });

  return (
    <div>
      <Label className="flex h-40 items-center" htmlFor="직업">
        직업
      </Label>

      <Select
        id="직업"
        style={{ width: 85 }}
        popupMatchSelectWidth={198}
        getPopupContainer={(trigger) => trigger}
        onChange={(value) => selectJob.onChange({ target: { name: '직업', value } })}
        options={SELECT_JOB_OPTIONS.map((option) => ({
          value: option,
          label: option,
        }))}
        defaultValue={SELECT_JOB_OPTIONS[0]}
      />
    </div>
  );
}

function RecordEmailAgreementCheckbox() {
  const { register } = useSicilianContext();
  const checkboxEmail = register({ name: '이메일 수신 동의', type: 'checkbox' });

  return (
    <div>
      <Label className="flex h-40 items-center" htmlFor="이메일 수신 동의">
        이메일 수신 동의
      </Label>

      <Checkbox
        id="이메일 수신 동의"
        name="이메일 수신 동의"
        checked={checkboxEmail.checked as unknown as boolean}
        onChange={(e: any) => checkboxEmail.onChange(e)}
      />
    </div>
  );
}
