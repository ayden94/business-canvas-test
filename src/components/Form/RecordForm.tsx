import { DatePicker, Form, Input, Select, Checkbox } from 'antd';
import Label from '../Label';
import { SELECT_JOB_OPTIONS } from '../../constants/select';
import { useForm } from 'sicilian/useForm';
import { SicilianEvent } from 'sicilian';

type Label = '이름' | '주소' | '메모' | '가입일' | '직업' | '이메일 수신 동의';

export default function RecordForm({ initValue }: { initValue?: Record<Label, unknown> }) {
  const { register } = useForm({
    initValue,
  });

  const selectCreateAt = register({ name: '가입일', type: 'date' });
  const selectJob = register({ name: '직업', type: 'radio' });
  const checkboxEmail = register({ name: '이메일 수신 동의', type: 'checkbox' });

  return (
    <Form layout="vertical">
      <Label htmlFor="이름" required>
        이름
      </Label>
      <Input {...register({ name: '이름' })} placeholder="이름" />

      <Label htmlFor="주소">주소</Label>
      <Input {...register({ name: '주소' })} placeholder="주소" />

      <Label htmlFor="메모">메모</Label>
      <Input.TextArea {...register({ name: '메모' })} placeholder="메모" />

      <Label htmlFor="가입일" required>
        가입일
      </Label>

      <DatePicker
        onChange={(value) =>
          selectCreateAt.onChange({
            target: { name: '가입일', value: value.toDate() as unknown as string },
          })
        }
        placeholder="가입일"
      />

      <div className="flex flex-col justify-center align-middle">
        <Label htmlFor="직업">직업</Label>
        <Select
          style={{ width: 85 }}
          popupMatchSelectWidth={198}
          onChange={(value) => selectJob.onChange({ target: { name: '직업', value } })}
          options={SELECT_JOB_OPTIONS.map((option) => ({
            value: option,
            label: option,
          }))}
          defaultValue={SELECT_JOB_OPTIONS[0]}
        />
      </div>

      <Label htmlFor="이메일 수신 동의">이메일 수신 동의</Label>
      <Checkbox
        id="이메일 수신 동의"
        name="이메일 수신 동의"
        onChange={(e) => checkboxEmail.onChange(e as SicilianEvent)}
      />
    </Form>
  );
}
