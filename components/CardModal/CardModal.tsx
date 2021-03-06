import React, { useEffect, useMemo, useState } from 'react';
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
import TrashIcon from '../../assets/icons/trash.svg';
import useLogger from '../../hooks/useLogger';
import {
  deleteDeadline,
  getCardById,
  saveDeadline,
  saveDescription,
  saveTitle,
  toggleIsCompleted,
} from '../../api/cards';
import { CardFiles, CardInterface } from '../../interfaces/card';
import Button from '../Button';
// import { CardChecklist } from '../../interfaces/checklist';
import CheckedCheckbox from '../../assets/icons/checkbox.svg';
import Checkbox from '../../assets/icons/square.svg';
import cn from 'classnames';
import { deleteFiles, deleteFilesItem, uploadFiles } from '../../api/files';
import Avatar from '../Avatar';
import { deleteExecutor, deleteExecutors, getAllUser, getExecutorsList, saveExecutor } from '../../api/user';
import { User } from '../../interfaces/user';
import { useRouter } from 'next/router';
import { isEqual } from 'lodash';
import { deleteChecklist } from '../../api/checklist';
import Executor from '../Executor';

interface Props {
  handleOutsideClick: () => void;
  id: number;
  card: CardInterface;
  updateCard: (columnId: number, cardId: number, field: keyof CardInterface, value: any) => void;
  deleteFromCard: (columnId: number, cardId: number, field: keyof CardInterface, deleteItemIdx: number) => void;
}

const CardModal = ({ handleOutsideClick, id, card, updateCard, deleteFromCard }: Props) => {
  // const [cardData, setCardData] = useState<CardInterface | null>(null);
  const [title, setTitle] = useState<string>(card.title);
  const [isDescriptionFocus, setIsDescriptionFocus] = useState<boolean>(false);
  const [description, setDescription] = useState<string>(card.description || '');
  const [isChecklistAdd, setIsChecklistAdd] = useState<boolean>(false);
  const [isFileAdd, setIsFileAdd] = useState<boolean>(false);
  const [isDateAdd, setIsDateAdd] = useState<boolean>(false);
  const [isExecutorsAdd, setIsExecutorsAdd] = useState<boolean>(false);
  // const [isExecutorMenuOpen, setIsExecutorMenuOpen] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [deadline, setDeadline] = useState<string>('');
  // const [checklist, setChecklist] = useState<CardChecklist[]>(card.checklists || []);
  const [isUsersListOpen, setIsUsersListOpen] = useState<boolean>(false);
  // const [cardFiles, setCardFiles] = useState<CardFiles[]>(card.files || []);
  const [users, setUsers] = useState<User[]>([]);
  const [executors, setExecutors] = useState<User[]>([]);
  const logger = useLogger();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getCardById(id);
        const { data: executorsList } = await getExecutorsList(id);

        // setCardData(data);
        // setTitle(data.title);
        // if (data.description) setDescription(data.description);
        // if (data.checklists) setChecklist(data.checklists);
        if (data.deadline) setDeadline(getISODate(new Date(data.deadline)));
        if (data.isComplited) setIsCompleted(data.isComplited);
        // if (data.files) setCardFiles(data.files);
        setExecutors(executorsList);
      } catch (err) {
        logger.error(err);
      }
    })();
  }, []);

  const sortedUsers = useMemo(() => {
    const availableUsers = users.filter(user => executors.every(executor => !isEqual(user, executor)));
    return availableUsers;
  }, [users, executors]);

  const handleAddChecklistToCard = () => setIsChecklistAdd(true);

  const handleAddFileToCard = () => setIsFileAdd(true);

  const handleAddDateToCard = () => setIsDateAdd(true);

  const handleCompleted = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const prevState = isCompleted;
    try {
      setIsCompleted(prev => !prev);
      await toggleIsCompleted({ id: id, isComplited: !isCompleted });
      updateCard(card.columnId, card.id, 'isComplited', !isCompleted);
    } catch (err) {
      setIsCompleted(prevState);
      logger.error(err);
    }
  };

  const handleSetDeadline = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setDeadline(e.target.value);
      const { data } = await saveDeadline({ id: id, deadline: new Date(e.target.value) });

      updateCard(card.columnId, card.id, 'deadline', new Date(e.target.value));
    } catch (err) {
      logger.error(err);
      setDeadline('');
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // const prevState = cardFiles;
    const { files } = e.target;
    const formData = new FormData();
    if (files) {
      try {
        // setFileName(files[0].name);
        formData.append('file', files[0]);
        const { data } = await uploadFiles(id, formData);

        updateCard(card.columnId, card.id, 'files', data);
        // setCardFiles(prev => [...prev, data]);
      } catch (err) {
        // updateCard(card.columnId, card.id, 'files',);
        logger.error(err);
      }
    }
  };

  const handleDownloadFile = (e: React.MouseEvent<HTMLElement>) => {
    const { id } = e.currentTarget.dataset;

    if (id) {
      const fileIdx = card.files.findIndex(file => file.id === +id);

      window.URL = window.URL || window.webkitURL;

      let xhr = new XMLHttpRequest(),
        a = document.createElement('a'),
        file;

      xhr.open('GET', `http://localhost:3001/${card.files[fileIdx].link}`, true);
      xhr.responseType = 'blob';
      xhr.onload = function () {
        file = new Blob([xhr.response], { type: 'application/octet-stream' });
        a.href = window.URL.createObjectURL(file);
        a.download = card.files[fileIdx].fileName; // Set to whatever file name you want

        a.click();
      };
      xhr.send();
    }
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSaveTitle = async () => {
    try {
      if (title !== '') {
        const { data } = await saveTitle({ id: id, title: title });
        updateCard(card.columnId, card.id, 'title', data.title);
      } else {
        updateCard(card.columnId, card.id, 'title', card.title);
        setTitle(card.title);
      }
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

  const handleAddExecutorToCard = () => {
    setIsExecutorsAdd(true);
  };

  const handleCloseUsersList = () => {
    setIsUsersListOpen(false);
  };

  const handleSelectExecutor = async (e: React.MouseEvent<HTMLElement>) => {
    const prevState = executors;
    try {
      const userId = e.currentTarget.dataset.id;
      const { data } = await saveExecutor({ cardId: id, deskId: +router.query.id!, userId: +userId! });
      setExecutors(prev => [...prev, data]);

      // const userIdx = users.findIndex(user => user.id === data.id);
      // console.log(userIdx);

      const sortUsers = users.filter(user => user.id !== data.id);
      setUsers(sortUsers);
    } catch (err) {
      setExecutors(prevState);
      logger.error(err);
    }
  };

  const handleAddDescription = async () => {
    try {
      await saveDescription({ id: id, description: description });
      setIsDescriptionFocus(false);
    } catch (err) {
      logger.error(err);
    }
  };

  const handleDeleteDeadline = async () => {
    try {
      await deleteDeadline({ id: card.id, isComplited: false });
      updateCard(card.columnId, card.id, 'deadline', '');
      updateCard(card.columnId, card.id, 'isComplited', false);
      setDeadline('');
      setIsDateAdd(false);
    } catch (err) {
      logger.error(err);
    }
  };

  const handleClearChecklist = async () => {
    try {
      deleteFromCard(card.columnId, card.id, 'checklists', -1);
      setIsChecklistAdd(false);
      await deleteChecklist(card.id);
    } catch (err) {
      logger.error(err);
    }
  };

  const handleDeleteFile = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const { id } = e.currentTarget.dataset;

      if (id) {
        deleteFromCard(card.columnId, card.id, 'files', +id);

        // setChecklistsTask(prev => prev.filter(item => item.id !== +id));
        await deleteFilesItem(+id);
      }
    } catch (err) {
      logger.error(err);
    }
  };

  const handleClearFiles = async () => {
    try {
      deleteFromCard(card.columnId, card.id, 'files', -1);
      setIsFileAdd(false);
      await deleteFiles(+id);
    } catch (err) {
      logger.error(err);
    }
  };

  const handleDeleteExecutor = async (e: React.MouseEvent<HTMLElement>) => {
    const { id } = e.currentTarget.dataset;
    if (id) {
      try {
        const newExecutorsList = executors.filter(executor => executor.id !== +id);
        setExecutors(newExecutorsList);
        await deleteExecutor(+id);
      } catch (err) {
        logger.error(err);
      }
    }
  };

  const handleDeleteExecutors = async () => {
    try {
      setExecutors([]);
      await deleteExecutors(id);
    } catch (err) {
      logger.error(err);
    }
  };

  return (
    <>
      {card && (
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
                    {(executors.length > 0 || isExecutorsAdd) && (
                      <>
                        <div className={s.executorWrap}>
                          <div className={s.titleWithCloseBtn}>
                            <p className={s.deadlineTitle}>??????????????????????</p>
                            <button className={s.closeDeadline} onClick={handleDeleteExecutors}>
                              <CrossIcon />
                            </button>
                          </div>

                          <div className={s.executorContainer}>
                            {executors.map(executor => (
                              <div className={s.executorWithMenu} key={executor.id}>
                                <Executor
                                  name={`${executor.name} ${executor.surname}`}
                                  handleDeleteExecutor={handleDeleteExecutor}
                                  id={executor.id}
                                />
                              </div>
                            ))}

                            <button className={s.addExecutorBtn} onClick={handleOpenUsersList}>
                              <PlusIcon />
                            </button>
                            {isUsersListOpen && (
                              <div className={s.usersList}>
                                <p className={s.usersListTitle}>??????????????????</p>
                                <div className={s.usersListSeparator}></div>
                                <ul className={s.users}>
                                  {sortedUsers.length === 0 ? (
                                    <p>?????????????????? ???? ??????????????</p>
                                  ) : (
                                    sortedUsers.map(user => (
                                      <li key={user.id}>
                                        <div onClick={handleSelectExecutor} data-id={user.id}>
                                          {user.name} {user.surname}
                                        </div>
                                      </li>
                                    ))
                                  )}
                                </ul>
                                <button className={s.closeUsersListBtn} onClick={handleCloseUsersList}>
                                  <CrossIcon />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {(isDateAdd || deadline.trim()) && (
                      <div className={s.deadlineWrap}>
                        <div className={s.titleWithCloseBtn}>
                          <p className={s.deadlineTitle}>???????? ????????????????????</p>
                          <button className={s.closeDeadline} onClick={handleDeleteDeadline}>
                            <CrossIcon />
                          </button>
                        </div>
                        <div className={s.datePickerWrapper}>
                          {deadline && (
                            <label className={s.checkboxTitle}>
                              <input
                                type="checkbox"
                                className={s.checkbox}
                                onChange={handleCompleted}
                                checked={isCompleted}
                              />
                              {isCompleted ? <CheckedCheckbox /> : <Checkbox />}
                            </label>
                          )}
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
                    <p className={s.title}>????????????????</p>
                  </div>
                  <div
                  // onBlur={handleDescriptionBlur}
                  >
                    <textarea
                      className={s.textarea}
                      value={description}
                      onChange={handleChangeDescription}
                      rows={3}
                      placeholder={'???????????????? ????????????????...'}
                      onClick={handleDescriptionFocus}
                    />
                    {isDescriptionFocus && (
                      <div className={s.addDescriptionWrap}>
                        <Button className={s.addDescriptionBtn} onClick={handleAddDescription} disabled={!description}>
                          ????????????????
                        </Button>
                        <button className={s.clearDescriptionBtn} onClick={handleClearDescription}>
                          <CrossIcon />
                        </button>
                      </div>
                    )}
                  </div>

                  {(isChecklistAdd || card.checklists.length > 0) && (
                    <>
                      <div className={s.titleWrap}>
                        <ChecklistIcon />
                        <p className={s.title}>??????-????????</p>
                        <button className={s.clearGroup} onClick={handleClearChecklist}>
                          <CrossIcon />
                        </button>
                      </div>
                      <Checklist
                        cardId={id}
                        data={card.checklists}
                        updateCard={updateCard}
                        columnId={card.columnId}
                        deleteFromCard={deleteFromCard}
                      />
                    </>
                  )}

                  {(isFileAdd || card.files.length > 0) && (
                    <>
                      <div className={s.titleWrap}>
                        <FileIcon />
                        <p className={s.title}>??????????</p>
                        <button className={s.clearGroup} onClick={handleClearFiles}>
                          <CrossIcon />
                        </button>
                      </div>
                      <ul className={s.filesList}>
                        {card.files.map(file => (
                          <li key={file.id}>
                            {file.link.trim() && (
                              <div className={s.fileWrapper}>
                                <a data-id={file.id} onClick={handleDownloadFile}>
                                  {file.fileName}
                                </a>
                                <button className={s.trashFileItem} onClick={handleDeleteFile} data-id={file.id}>
                                  <TrashIcon />
                                </button>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                      <label className={s.labelInputFile}>
                        <AddChecklistIcon />
                        <input type="file" className={s.inputFile} onChange={handleUploadFile} />
                        ???????????????????? ????????
                      </label>
                    </>
                  )}
                  <div className={s.titleWrap}>
                    <CommentsIcon />
                    <p className={s.title}>??????????????????????</p>
                  </div>
                  <Comments data={card.comments} cardId={id} updateCard={updateCard} columnId={card.columnId} />
                </div>
                <div className={s.addItemsWrap}>
                  {/* <button type="button" className={s.closeBtn} onClick={handleOutsideClick}>
                <CrossIcon />
              </button> */}
                  <div className={s.titleWrap}>
                    {/* <AddChecklistIcon /> */}
                    ???????????????? ???? ????????????????
                  </div>
                  <div className={s.btnsWrap}>
                    {!isChecklistAdd && !(card.checklists.length > 0) && (
                      <button className={s.addButton} onClick={handleAddChecklistToCard}>
                        <ChecklistIcon />
                        ??????-????????
                      </button>
                    )}
                    {!isFileAdd && !(card.files.length > 0) && (
                      <button className={s.addButton} onClick={handleAddFileToCard}>
                        <FileIcon />
                        ????????
                      </button>
                    )}
                    {!isDateAdd && !deadline.trim() && (
                      <button className={s.addButton} onClick={handleAddDateToCard}>
                        <ClockIcon />
                        ????????
                      </button>
                    )}
                    {!isExecutorsAdd && !(executors.length > 0) && (
                      <button className={s.addButton} onClick={handleAddExecutorToCard}>
                        <PeopleIcon />
                        ????????????????????????
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
