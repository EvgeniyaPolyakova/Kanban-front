import React, { useMemo } from 'react';
import cn from 'classnames';
import s from './Avatar.module.scss';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

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
    <Tippy content={name}>
      <div className={cn(s.avatar, classname)} onClick={onClick}>
        {abbreviation}
      </div>
    </Tippy>
  );
};

export default Avatar;
