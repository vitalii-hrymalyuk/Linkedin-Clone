import { ReactNode } from 'react';

const PostAction = ({
  icon,
  text,
  onClick,
}: {
  icon: ReactNode;
  text: string;
  onClick?: () => void;
}) => {
  return (
    <button className="flex items-center" onClick={onClick}>
      <span className="mr-1">{icon}</span>
      <span className="hidden sm:inline">{text}</span>
    </button>
  );
};

export default PostAction;
