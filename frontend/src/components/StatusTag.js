import { Tag } from 'antd';

const StatusTag = ({ status }) => {
  const statusColors = {
    'Pending': 'blue',
    'Approved': 'green',
    'Needs Revision': 'orange'
  };

  return <Tag color={statusColors[status]}>{status}</Tag>;
};

export default StatusTag;