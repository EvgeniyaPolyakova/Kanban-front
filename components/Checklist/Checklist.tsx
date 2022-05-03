import React, { useState, useMemo } from 'react';
import CheckedCheckbox from '../../assets/icons/checkbox.svg';
import Checkbox from '../../assets/icons/square.svg';
import AddChecklistIcon from '../../assets/icons/circle-plus.svg';
import Input from '../Input';
import Button from '../Button';
import s from './Checklist.module.scss';
import { CardChecklist } from '../../interfaces/checklist';
import useLogger from '../../hooks/useLogger';
import { createTask, toggleComplited } from '../../api/checklist';

interface Props {
  cardId: number;
  data: CardChecklist[];
}

const Checklist = ({ cardId, data }: Props) => {
  const [newChecklistItem, setNewChecklistItem] = useState<string>('');
  const [isOpenCreateForm, setIsOpenCreateForm] = useState<boolean>(false);
  const [checklistTasks, setChecklistsTask] = useState<CardChecklist[]>(data);
  const logger = useLogger();

  const progressWidth = useMemo<number>(() => {
    if (checklistTasks.length === 0) return 0;
    const tasksLength = checklistTasks.length;
    const completedTasksLength = checklistTasks.filter(task => task.isChecked).length;

    return Math.floor((completedTasksLength / tasksLength) * 100);
  }, [checklistTasks]);

  const handleChecked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = e.target.dataset;
    const prevState = checklistTasks;

    try {
      if (id) {
        const isTaskComplited = checklistTasks.find(task => task.id === +id)?.isChecked;
        await toggleComplited({ id: +id, isChecked: !isTaskComplited });
        setChecklistsTask(prev => prev.map(task => (task.id === +id ? { ...task, isChecked: !task.isChecked } : task)));
      }
    } catch (err) {
      setChecklistsTask(prevState);
      logger.error(err);
    }
  };

  const handleAddNewItem = async (e: React.FormEvent<HTMLFormElement>) => {
    const prevState = checklistTasks;
    e.preventDefault();
    try {
      const { data } = await createTask({ task: newChecklistItem, isChecked: false, cardId: cardId });

      setChecklistsTask(prev => [...prev, data]);
      setNewChecklistItem('');
      setIsOpenCreateForm(false);
    } catch (err) {
      setChecklistsTask(prevState);
      logger.error(err);
    }
  };

  const handleChangeNewChecklistItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewChecklistItem(e.target.value);
  };

  const handleClickAddNewItem = () => {
    setIsOpenCreateForm(true);
  };

  return (
    <>
      <div className={s.checklistProgress}>
        <span className={s.progressPercent}>{`${progressWidth}%`}</span>
        <div className={s.progressBar}>
          <div className={s.progress} style={{ width: `${progressWidth}%` }} />
        </div>
      </div>

      {checklistTasks.map(task => (
        <label className={s.checkboxTitle} key={task.id}>
          <input
            data-id={task.id}
            type="checkbox"
            className={s.checkbox}
            onChange={handleChecked}
            checked={task.isChecked}
            value={task.task}
          />
          {task.isChecked ? <CheckedCheckbox /> : <Checkbox />}
          {task.task}
        </label>
      ))}

      {!isOpenCreateForm ? (
        <button className={s.addChecklistItem} onClick={handleClickAddNewItem}>
          <AddChecklistIcon /> Добавить элемент
        </button>
      ) : (
        <form onSubmit={handleAddNewItem}>
          <Input value={newChecklistItem} className={s.inputNewItem} onChange={handleChangeNewChecklistItem} />
          <Button type="submit" className={s.addNewItemBtn}>
            Добавить
          </Button>
        </form>
      )}
    </>
  );
};

export default React.memo(Checklist);
