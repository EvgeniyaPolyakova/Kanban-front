import React, { useMemo } from 'react';
import cn from 'classnames';
import s from './Avatar.module.scss';

interface Props {
  name: string;
  classname?: string;
  onClick?: () => void;
}

const Avatar = ({ name, classname, onClick }: Props) => {
  const abbreviation = useMemo<string>(() => {
    const [firstName, lastName] = name.split(' ');
    return firstName[0].toUpperCase() + lastName[0].toUpperCase();
  }, [name]);

  return (
    <div className={cn(s.avatar, classname)} onClick={onClick}>
      {abbreviation}
    </div>
  );
};

export default Avatar;
