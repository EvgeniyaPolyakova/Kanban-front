import s from "./CreateDesk.module.scss";
import CreateIcon from "../../assets/icons/create-desk.svg";

interface Props {
  onClick: () => void;
}

const CreateDesk = ({ onClick }: Props) => {
  return (
    <button type="button" className={s.btn} onClick={onClick}>
      <CreateIcon />
      Создать доску
      <span className={s.btnText}>
        Создайте собственную доску и сразу приступайте к планированию задач.
      </span>
    </button>
  );
};

export default CreateDesk;
