import s from './DeskItem.module.scss';
import DeskIcon from '../../assets/icons/desk.svg';
import Link from 'next/link';

interface Props {
  name: string;
}

const DeskItem = ({ name }: Props) => {
  return (
    <Link href="/desk/1">
      <a className={s.wrap}>
        <DeskIcon />
        {name}
      </a>
    </Link>
  );
};

export default DeskItem;
