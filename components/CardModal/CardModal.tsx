import React, { useEffect, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import s from './CardModal.module.scss';
import TitleIcon from '../../assets/icons/card-title.svg';
import DescriptionIcon from '../../assets/icons/description.svg';
import ChecklistIcon from '../../assets/icons/checklist.svg';
import AddChecklistIcon from '../../assets/icons/circle-plus.svg';
import FileIcon from '../../assets/icons/file.svg';
import ClockIcon from '../../assets/icons/clock.svg';
import Checklist from '../Checklist';
import { getISODate } from '../../helpers/date';
import Comments from '../Comments';
import CommentsIcon from '../../assets/icons/comment.svg';
import CrossIcon from '../../assets/icons/cross.svg';
import PeopleIcon from '../../assets/icons/people.svg';
import PlusIcon from '../../assets/icons/plus-icon.svg';
import useLogger from '../../hooks/useLogger';
import { getCardById, saveDeadline, saveDescription, saveTitle, toggleIsCompleted } from '../../api/cards';
import { CardFiles, CardInterface } from '../../interfaces/card';
import Button from '../Button';
import { CardChecklist } from '../../interfaces/checklist';
import CheckedCheckbox from '../../assets/icons/checkbox.svg';
import Checkbox from '../../assets/icons/square.svg';
import cn from 'classnames';
import { uploadFiles } from '../../api/files';
import Avatar from '../Avatar';
import { getAllUser } from '../../api/user';
import { User } from '../../interfaces/user';

interface Props {
  handleOutsideClick: () => void;
  id: number;
  cardData: CardInterface | null;
}

const CardModal = ({ handleOutsideClick, id }: Props) => {
  const [cardData, setCardData] = useState<CardInterface | null>(null);
  const [title, setTitle] = useState<string>('');
  const [isDescriptionFocus, setIsDescriptionFocus] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [isChecklistAdd, setIsChecklistAdd] = useState<boolean>(false);
  const [isFileAdd, setIsFileAdd] = useState<boolean>(false);
  const [isDateAdd, setIsDateAdd] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [deadline, setDeadline] = useState<string>('');
  // const [fileName, setFileName] = useState<string>('');
  const [checklist, setChecklist] = useState<CardChecklist[]>([]);
  const [isUsersListOpen, setIsUsersListOpen] = useState<boolean>(false);
  const [cardFiles, setCardFiles] = useState<CardFiles[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const logger = useLogger();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getCardById(id);

        setCardData(data);
        setTitle(data.title);
        if (data.description) setDescription(data.description);
        if (data.checklists) setChecklist(data.checklists);
        if (data.deadline) setDeadline(getISODate(new Date(data.deadline)));
        if (data.isComplited) setIsCompleted(data.isComplited);
        if (data.files) setCardFiles(data.files);
      } catch (err) {
        logger.error(err);
      }
    })();
  }, []);

  const handleAddChecklistToCard = () => setIsChecklistAdd(true);

  const handleAddFileToCard = () => setIsFileAdd(true);

  const handleAddDateToCard = () => setIsDateAdd(true);

  const handleCompleted = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const prevState = isCompleted;
    try {
      setIsCompleted(prev => !prev);
      await toggleIsCompleted({ id: id, isComplited: !isCompleted });
    } catch (err) {
      setIsCompleted(prevState);
      logger.error(err);
    }
  };

  const handleSetDeadline = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setDeadline(e.target.value);
      await saveDeadline({ id: id, deadline: new Date(e.target.value) });
    } catch (err) {
      logger.error(err);
      setDeadline('');
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const prevState = cardFiles;
    const { files } = e.target;
    const formData = new FormData();
    if (files) {
      try {
        // setFileName(files[0].name);
        formData.append('file', files[0]);
        const { data } = await uploadFiles(id, formData);
        setCardFiles(prev => [...prev, data]);
      } catch (err) {
        setCardFiles(prevState);
        logger.error(err);
      }
    }
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSaveTitle = async () => {
    try {
      await saveTitle({ id: id, title: title });
    } catch (err) {
      logger.error(err);
    }
  };

  const handleChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleDescriptionFocus = () => {
    setIsDescriptionFocus(true);
  };

  const handleDescriptionBlur = () => {
    setIsDescriptionFocus(false);
  };

  const handleClearDescription = () => {
    console.log('clear');

    setDescription('');
    setIsDescriptionFocus(false);
  };

  const handleOpenUsersList = async () => {
    try {
      const { data } = await getAllUser();
      // console.log(data);
      setUsers(data);
    } catch (err) {
      logger.error(err);
    }

    setIsUsersListOpen(true);
  };

  const handleCloseUsersList = () => {
    setIsUsersListOpen(false);
  };

  const handleSelectExecutor = () => {
    console.log('select');
  };

  const handleAddDescription = async () => {
    console.log('save');

    try {
      await saveDescription({ id: id, description: description });
      setIsDescriptionFocus(false);
    } catch (err) {
      logger.error(err);
    }
  };

  console.log(cardFiles);

  return (
    <>
      {cardData && (
        <div className={s.modalWrap}>
          <div className={s.modalBackDrop} />
          <div className={s.modalBody}>
            <OutsideClickHandler onOutsideClick={handleOutsideClick}>
              <button type="button" className={s.closeBtn} onClick={handleOutsideClick}>
                <CrossIcon />
              </button>
              <div className={s.cardWrap}>
                <div>
                  <div className={s.titleWrap}>
                    <TitleIcon />
                    <input
                      className={s.cardTitle}
                      value={title}
                      onBlur={handleSaveTitle}
                      onChange={handleChangeTitle}
                    />
                  </div>
                  <div className={s.executorDateWrap}>
                    <div className={s.executorWrap}>
                      <p className={s.deadlineTitle}>Исполнители</p>
                      <div className={s.executorContainer}>
                        <Avatar name="Иван Иванов" />
                        <Avatar name="Иван Иванов" />
                        <button className={s.addExecutorBtn} onClick={handleOpenUsersList}>
                          <PlusIcon />
                        </button>
                        {isUsersListOpen && (
                          <div className={s.usersList}>
                            <p className={s.usersListTitle}>Участники</p>
                            <div className={s.usersListSeparator}></div>
                            <ul className={s.users}>
                              {users.map(user => (
                                <li key={user.id}>
                                  <div onClick={handleSelectExecutor}>
                                    {user.name} {user.surname}
                                  </div>
                                </li>
                              ))}
                              {/* <li>Иван Иванов</li>
                              <li>Евгения Полякова</li>
                              <li>Иван Иванов</li>
                              <li>Евгения Полякова</li>
                              <li>Иван Иванов</li>
                              <li>Евгения Полякова</li>
                              <li>Иван Иванов</li>
                              <li>Евгения Полякова</li> */}
                            </ul>
                            <button className={s.closeUsersListBtn} onClick={handleCloseUsersList}>
                              <CrossIcon />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {(isDateAdd || deadline.trim()) && (
                      <div className={s.deadlineWrap}>
                        <p className={s.deadlineTitle}>Срок исполнения</p>
                        <div className={s.datePickerWrapper}>
                          <label className={s.checkboxTitle}>
                            <input
                              type="checkbox"
                              className={s.checkbox}
                              onChange={handleCompleted}
                              checked={isCompleted}
                            />
                            {isCompleted ? <CheckedCheckbox /> : <Checkbox />}
                          </label>
                          <input
                            type="date"
                            className={cn(s.datePicker, { [s.completedDeadline]: isCompleted })}
                            value={deadline}
                            onChange={handleSetDeadline}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={s.titleWrap}>
                    <DescriptionIcon />
                    <p className={s.title}>Описание</p>
                  </div>
                  <div
                  // onBlur={handleDescriptionBlur}
                  >
                    <textarea
                      className={s.textarea}
                      value={description}
                      onChange={handleChangeDescription}
                      rows={3}
                      placeholder={'Добавьте описание...'}
                      onClick={handleDescriptionFocus}
                    />
                    {isDescriptionFocus && (
                      <div className={s.addDescriptionWrap}>
                        <Button className={s.addDescriptionBtn} onClick={handleAddDescription}>
                          Добавить
                        </Button>
                        <button className={s.clearDescriptionBtn} onClick={handleClearDescription}>
                          <CrossIcon />
                        </button>
                      </div>
                    )}
                  </div>

                  {(isChecklistAdd || checklist.length > 0) && (
                    <>
                      <div className={s.titleWrap}>
                        <ChecklistIcon />
                        <p className={s.title}>Чек-лист</p>
                      </div>
                      <Checklist cardId={id} data={checklist} />
                    </>
                  )}

                  {(isFileAdd || cardFiles.length > 0) && (
                    <>
                      <div className={s.titleWrap}>
                        <FileIcon />
                        <p className={s.title}>Файлы</p>
                      </div>
                      <ul className={s.filesList}>
                        {cardFiles.map(file => (
                          <li key={file.id}>
                            {file.binaryData.trim() && (
                              <a
                                download={file.fileName}
                                href={`http://localhost:3001/${file.binaryData}`}
                                // target="_blank"
                              >
                                {file.fileName}
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                      <label className={s.labelInputFile}>
                        <AddChecklistIcon />
                        <input type="file" className={s.inputFile} onChange={handleUploadFile} />
                        Прикрепить файл
                      </label>
                    </>
                  )}
                  <div className={s.titleWrap}>
                    <CommentsIcon />
                    <p className={s.title}>Комментарии</p>
                  </div>
                  <Comments />
                </div>
                <div className={s.addItemsWrap}>
                  {/* <button type="button" className={s.closeBtn} onClick={handleOutsideClick}>
                <CrossIcon />
              </button> */}
                  <div className={s.titleWrap}>
                    {/* <AddChecklistIcon /> */}
                    Добавить на карточку
                  </div>
                  <div className={s.btnsWrap}>
                    {!isChecklistAdd && !(checklist.length > 0) && (
                      <button className={s.addButton} onClick={handleAddChecklistToCard}>
                        <ChecklistIcon />
                        Чек-лист
                      </button>
                    )}
                    {!isFileAdd && !(cardFiles.length > 0) && (
                      <button className={s.addButton} onClick={handleAddFileToCard}>
                        <FileIcon />
                        Файл
                      </button>
                    )}
                    {!isDateAdd && !deadline.trim() && (
                      <button className={s.addButton} onClick={handleAddDateToCard}>
                        <ClockIcon />
                        Дату
                      </button>
                    )}
                    {!isDateAdd && !deadline.trim() && (
                      <button className={s.addButton} onClick={handleAddDateToCard}>
                        <PeopleIcon />
                        Исполнителей
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </OutsideClickHandler>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(CardModal);
