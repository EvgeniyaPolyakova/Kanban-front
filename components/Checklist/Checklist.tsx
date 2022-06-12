import React, { useState, useMemo } from 'react';
import CheckedCheckbox from '../../assets/icons/checkbox.svg';
import Checkbox from '../../assets/icons/square.svg';
import AddChecklistIcon from '../../assets/icons/circle-plus.svg';
import TrashIcon from '../../assets/icons/trash.svg';
import Input from '../Input';
import Button from '../Button';
import s from './Checklist.module.scss';
import { CardChecklist } from '../../interfaces/checklist';
import useLogger from '../../hooks/useLogger';
import { createTask, deleteChecklistItem, toggleComplited } from '../../api/checklist';
import { CardInterface } from '../../interfaces/card';

export interface ChecklistProps {
  cardId: number;
  data: CardChecklist[];
  updateCard: (columnId: number, cardId: number, field: keyof CardInterface, value: any) => void;
  columnId: number;
  deleteFromCard: (columnId: number, cardId: number, field: keyof CardInterface, deleteItemIdx: number) => void;
}

const Checklist = ({ cardId, data, updateCard, columnId, deleteFromCard }: ChecklistProps) => {
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
        const { data } = await toggleComplited({ id: +id, isChecked: !isTaskComplited });

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
      updateCard(columnId, cardId, 'checklists', data);

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

  const handleDeleteTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const { id } = e.currentTarget.dataset;

      if (id) {
        deleteFromCard(columnId, cardId, 'checklists', +id);
        setChecklistsTask(prev => prev.filter(item => item.id !== +id));
        await deleteChecklistItem(+id);
      }
    } catch (err) {
      logger.error(err);
    }
  };

  return (
    <>
      <div className={s.checklistProgress}>
        <span data-testid="checklist-progress" className={s.progressPercent}>{`${progressWidth}%`}</span>
        <div className={s.progressBar}>
          <div className={s.progress} style={{ width: `${progressWidth}%` }} />
        </div>
      </div>

      {checklistTasks.map(task => (
        <div data-testid="checklist-task" key={task.id} className={s.checklistTaskWrap}>
          <label className={s.checkboxTitle}>
            <input
              data-id={task.id}
              type="checkbox"
              className={s.checkbox}
              onChange={handleChecked}
              checked={task.isChecked}
              value={task.task}
            />
            {/*{task.isChecked ? <CheckedCheckbox /> : <Checkbox />}*/}
            {task.task}
          </label>
          <button className={s.trashChecklistItem} onClick={handleDeleteTask} data-id={task.id}>
            {/*<TrashIcon />*/}
          </button>
        </div>
      ))}

      {!isOpenCreateForm ? (
        <button className={s.addChecklistItem} onClick={handleClickAddNewItem}>
          {/*<AddChecklistIcon /> */} Добавить элемент
        </button>
      ) : (
        <form onSubmit={handleAddNewItem}>
          <Input value={newChecklistItem} className={s.inputNewItem} onChange={handleChangeNewChecklistItem} />
          <Button type="submit" className={s.addNewItemBtn} disabled={!newChecklistItem}>
            Добавить
          </Button>
        </form>
      )}
    </>
  );
};

export default React.memo(Checklist);
