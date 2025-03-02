import { Checkbox, Menu } from 'antd';
import { Key } from 'react';

export const tableFilterDropdown =
  <T,>(dataList: T[], key: keyof T) =>
  ({
    setSelectedKeys,
    selectedKeys,
    confirm,
  }: {
    setSelectedKeys: (keys: Key[]) => void;
    selectedKeys: Key[];
    confirm: () => void;
  }) => {
    const handleChange = (checked: boolean, value: string) => {
      const newSelectedKeys = checked
        ? [...(selectedKeys as string[]), value]
        : (selectedKeys as string[]).filter((key) => key !== value);

      setSelectedKeys(newSelectedKeys);
      confirm(); // 즉시 필터 적용
    };

    return (
      <Menu
        items={removeDuplicateInColumnFilterArray(dataList, key).map((name) => ({
          key: name,
          label: (
            <Checkbox
              checked={(selectedKeys as string[]).includes(name)}
              onChange={(e) => handleChange(e.target.checked, name)}
            >
              {name}
            </Checkbox>
          ),
        }))}
      />
    );
  };

const removeDuplicateInColumnFilterArray = <T,>(array: T[], key: keyof T) => {
  return Array.from(
    new Set(
      array
        .filter((data) => (typeof data[key] === 'string' ? data[key] : true))
        .map((data) => JSON.stringify(data[key])),
    ),
  ).map((item) => {
    const parsedItem = JSON.parse(item);
    return typeof parsedItem === 'string' ? parsedItem : String(parsedItem);
  });
};
