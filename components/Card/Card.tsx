import s from "./Card.module.scss";

interface Props {
  title: string;
  onClick: () => void;
}

const Card = ({ title, onClick }: Props) => {
  return (
    <button type="button" className={s.card} onClick={onClick}>
      {title}
    </button>
  );
};

export default Card;
