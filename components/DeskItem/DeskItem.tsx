import s from './DeskItem.module.scss';
import DeskIcon from '../../assets/icons/desk.svg';
import Link from 'next/link';

interface Props {
  name: string;
  id: number;
}

const DeskItem = ({ name, id }: Props) => {
  return (
    <Link href={`/desk/${id}`}>
      <a className={s.wrap}>
        <DeskIcon />
        {name}
      </a>
    </Link>
  );
};

export default DeskItem;
