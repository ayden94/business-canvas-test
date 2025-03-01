import { DatePicker, Input, Select, Checkbox } from 'antd';
import { SELECT_JOB_OPTIONS } from '../../constants/select';
import { useForm } from 'sicilian/useForm';
import { SicilianEvent } from 'sicilian';
import { type Label as LabelType } from '../../types/Label';
import Label from '../Label';
import Form from './Form';

export default function RecordForm({ initValue }: { initValue?: Record<LabelType, unknown> }) {
  const { register } = useForm({
    initValue,
  });

  const selectCreateAt = register({ name: '가입일', type: 'date' });
  const selectJob = register({ name: '직업', type: 'radio' });
  const checkboxEmail = register({ name: '이메일 수신 동의', type: 'checkbox' });

  const handlePopupContainer = (trigger: HTMLElement) => {
    return trigger;
  };

  return (
    <Form className="mx-24 mt-10 mb-20 flex w-520 flex-col gap-20">
      <div>
        <Label className="flex h-40 items-center" htmlFor="이름" required>
          이름
        </Label>
        <Input {...register({ name: '이름' })} placeholder="이름" />
      </div>

      <div>
        <Label className="flex h-40 items-center" htmlFor="주소">
          주소
        </Label>
        <Input {...register({ name: '주소' })} placeholder="주소" />
      </div>

      <div>
        <Label className="flex h-40 items-center" htmlFor="메모">
          메모
        </Label>
        <Input.TextArea {...register({ name: '메모' })} placeholder="메모" />
      </div>

      <div>
        <Label className="flex h-40 items-center" htmlFor="가입일" required>
          가입일
        </Label>
        <DatePicker
          showToday={false}
          getPopupContainer={handlePopupContainer}
          onChange={(value) =>
            selectCreateAt.onChange({
              target: { name: '가입일', value: value.toDate() as unknown as string },
            })
          }
          placeholder="가입일"
        />
      </div>

      <div>
        <Label className="flex h-40 items-center" htmlFor="직업">
          직업
        </Label>
        <Select
          style={{ width: 85 }}
          popupMatchSelectWidth={198}
          getPopupContainer={handlePopupContainer}
          onChange={(value) => selectJob.onChange({ target: { name: '직업', value } })}
          options={SELECT_JOB_OPTIONS.map((option) => ({
            value: option,
            label: option,
          }))}
          defaultValue={SELECT_JOB_OPTIONS[0]}
        />
      </div>

      <div>
        <Label className="flex h-40 items-center" htmlFor="이메일 수신 동의">
          이메일 수신 동의
        </Label>

        <Checkbox
          id="이메일 수신 동의"
          name="이메일 수신 동의"
          onChange={(e) => checkboxEmail.onChange(e as SicilianEvent)}
        />
      </div>
    </Form>
  );
}
