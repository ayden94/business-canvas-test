import { Dropdown, MenuProps } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

const KebabMenu = ({
  items,
  handleMenuClick,
  className,
}: {
  items: MenuProps['items'];
  handleMenuClick: MenuProps['onClick'];
  className?: string;
}) => {
  return (
    <Dropdown menu={{ items, onClick: handleMenuClick, className }} trigger={['click']}>
      <button className="flex justify-center border-none bg-transparent p-8">
        <EllipsisOutlined style={{ fontSize: 20, transform: 'rotate(90deg)' }} />
      </button>
    </Dropdown>
  );
};

export default KebabMenu;
