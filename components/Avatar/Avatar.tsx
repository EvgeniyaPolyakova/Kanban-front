import React, { useMemo } from 'react';
import s from './Avatar.module.scss';

interface Props {
  name: string;
}

const Avatar = ({ name }: Props) => {
  const abbreviation = useMemo<string>(() => {
    const [firstName, lastName] = name.split(' ');
    return firstName[0].toUpperCase() + lastName[0].toUpperCase();
  }, [name]);

  return <div className={s.avatar}>{abbreviation}</div>;
};

export default Avatar;
