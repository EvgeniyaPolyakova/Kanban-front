import CheckedCheckbox from "../../assets/icons/checkbox.svg";
import Checkbox from "../../assets/icons/square.svg";
import AddCheclistIcon from "../../assets/icons/circle-plus.svg";
import Input from "../Input";
import Button from "../Button";
import s from "./Checklist.module.scss";
import { useEffect, useState } from "react";
import { CardChecklist } from "../../interfaces/card";

const ChecklistArray: CardChecklist[] = [
  {
    id: 1,
    task: "Задача 1",
    complited: true,
  },
  {
    id: 2,
    task: "Задача 2",
    complited: false,
  },
  {
    id: 3,
    task: "Задача 3",
    complited: true,
  },
];

const Checklist = () => {
  const [newChecklistItem, setNewChecklistItem] = useState<string>("");
  const [isOpenCreateForm, setIsOpenCreateForm] = useState<boolean>(false);
  const [progressWidth, setProgressWidth] = useState<number>(0);
  const [checklistTasks, setChecklistsTask] =
    useState<CardChecklist[]>(ChecklistArray);

  const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = e.target.dataset;

    if (id)
      setChecklistsTask((prev) =>
        prev.map((task) =>
          task.id === +id
            ? { id: task.id, task: task.task, complited: !task.complited }
            : task
        )
      );
  };

  const handleAddNewItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChecklistsTask((prev) => [
      ...prev,
      { id: Date.now(), task: newChecklistItem, complited: false },
    ]);
    setNewChecklistItem("");
    setIsOpenCreateForm(false);
  };

  const handleChangeNewChecklistItem = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewChecklistItem(e.target.value);
  };

  const handleClickAddNewItem = () => {
    setIsOpenCreateForm(true);
  };

  useEffect(() => {
    const tasksNumber = checklistTasks.length;

    const complitedTasks = checklistTasks.filter(
      (task) => task.complited === true
    );
    const checkedTasksNumber = complitedTasks.length;
    const persent = Math.round((checkedTasksNumber / tasksNumber) * 100);

    setProgressWidth(persent);
  }, [checklistTasks]);

  return (
    <>
      <div className={s.checklistProgress}>
        <span className={s.progressPercent}>{`${progressWidth}%`}</span>
        <div className={s.progressBar}>
          <div
            className={s.progress}
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>
      </div>

      {checklistTasks.map((task) => (
        <label className={s.checkboxTitle} key={task.id}>
          <input
            data-id={task.id}
            type="checkbox"
            className={s.checkbox}
            onChange={handleChecked}
            checked={task.complited}
            value={task.task}
          />
          {task.complited ? <CheckedCheckbox /> : <Checkbox />}
          {task.task}
        </label>
      ))}

      {!isOpenCreateForm ? (
        <button className={s.addChecklistItem} onClick={handleClickAddNewItem}>
          <AddCheclistIcon /> Добавить элемент
        </button>
      ) : (
        <form onSubmit={handleAddNewItem}>
          <Input
            value={newChecklistItem}
            className={s.inputNewItem}
            onChange={handleChangeNewChecklistItem}
          />
          <Button type="submit" className={s.addNewItemBtn}>
            Добавить
          </Button>
        </form>
      )}
    </>
  );
};

export default Checklist;
