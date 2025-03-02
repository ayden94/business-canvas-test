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
      <Menu>
        {dataList
          .filter((data) => data[key as keyof T])
          .map((data) => String(data[key as keyof T]))
          .map((name) => (
            <Menu.Item key={name}>
              <Checkbox
                checked={(selectedKeys as string[]).includes(name)}
                onChange={(e) => handleChange(e.target.checked, name)}
              >
                {name}
              </Checkbox>
            </Menu.Item>
          ))}
      </Menu>
    );
  };
