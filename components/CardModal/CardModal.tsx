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
import useLogger from '../../hooks/useLogger';
import { getCardById, saveDescription, saveTitle } from '../../api/cards';
import { CardInterface } from '../../interfaces/card';
import Button from '../Button';
import { CardChecklist } from '../../interfaces/checklist';

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
  const [deadline, setDeadline] = useState<string>(getISODate(new Date()));
  const [fileName, setFileName] = useState<string>('');
  const [checklist, setChecklist] = useState<CardChecklist[]>([]);
  const logger = useLogger();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getCardById(id);

        setCardData(data);
        setTitle(data.title);
        if (data.description) setDescription(data.description);
        if (data.checklists) setChecklist(data.checklists);
      } catch (err) {
        logger.error(err);
      }
    })();
  }, []);

  // useEffect(() => {
  //   if (cardData) setTitle(cardData.title);
  // }, []);

  const handleAddChecklistToCard = () => setIsChecklistAdd(true);

  const handleAddFileToCard = () => setIsFileAdd(true);

  const handleAddDateToCard = () => setIsDateAdd(true);

  const handleSetDeadline = (e: React.ChangeEvent<HTMLInputElement>) => setDeadline(e.target.value);

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      setFileName(files[0].name);
      // let formData = new FormData();
      // formData.append("file", files[0]);
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

  const handleAddDescription = async () => {
    console.log('save');

    try {
      await saveDescription({ id: id, description: description });
      setIsDescriptionFocus(false);
    } catch (err) {
      logger.error(err);
    }
  };

  console.log('checklist', checklist);

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
                  {isDateAdd && (
                    <input type="date" className={s.datePicker} value={deadline} onChange={handleSetDeadline} />
                  )}
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
                      placeholder={'Добавить описание...'}
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

                  {isFileAdd && (
                    <>
                      <div className={s.titleWrap}>
                        <FileIcon />
                        <p className={s.title}>Файлы</p>
                      </div>
                      <ul className={s.filesList}>
                        <li>{fileName}</li>
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
                    <button className={s.addButton} onClick={handleAddChecklistToCard}>
                      <ChecklistIcon />
                      Чек-лист
                    </button>
                    <button className={s.addButton} onClick={handleAddFileToCard}>
                      <FileIcon />
                      Файл
                    </button>
                    <button className={s.addButton} onClick={handleAddDateToCard}>
                      <ClockIcon />
                      Дату
                    </button>
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
