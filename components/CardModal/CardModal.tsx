import React, { useEffect, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import s from "./CardModal.module.scss";
import TitleIcon from "../../assets/icons/card-title.svg";
import DescriptionIcon from "../../assets/icons/description.svg";
import ChecklistIcon from "../../assets/icons/checklist.svg";
import AddCheclistIcon from "../../assets/icons/circle-plus.svg";
import FileIcon from "../../assets/icons/file.svg";
import ClockIcon from "../../assets/icons/clock.svg";
import Checklist from "../Checklist";
import { getISODate } from "../../helpers/date";
import Comments from "../Comments";
import CommentsIcon from "../../assets/icons/comment.svg";

interface Props {
  handleOutsideClick: () => void;
}

const CardModal = ({ handleOutsideClick }: Props) => {
  const [isChecklistAdd, setIsChecklistAdd] = useState<boolean>(false);
  const [isFileAdd, setIsFileAdd] = useState<boolean>(false);
  const [isDateAdd, setIsDateAdd] = useState<boolean>(false);
  const [deadline, setDeadline] = useState<string>(getISODate(new Date()));
  const [fileName, setFileName] = useState<string>("");

  const handleAddChecklistToCard = () => {
    setIsChecklistAdd(true);
  };

  const handleAddFileToCard = () => {
    setIsFileAdd(true);
  };

  const handleAddDateToCard = () => {
    setIsDateAdd(true);
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFileName(files[0].name);
      // let formData = new FormData();
      // formData.append("file", files[0]);
    }
  };

  const handleSetDeadline = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline(e.target.value);
  };

  return (
    <div className={s.modalWrap}>
      <div className={s.modalBackDrop} />
      <div className={s.modalBody}>
        <OutsideClickHandler onOutsideClick={handleOutsideClick}>
          <div className={s.cardWrap}>
            <div>
              <div className={s.titleWrap}>
                <TitleIcon />
                <p className={s.title}>Title</p>
              </div>
              {isDateAdd && (
                <input
                  type="date"
                  className={s.datePicker}
                  value={deadline}
                  onChange={handleSetDeadline}
                />
              )}
              <div className={s.titleWrap}>
                <DescriptionIcon />
                <p className={s.title}>Описание</p>
              </div>
              <textarea className={s.textarea} rows={3} />

              {isChecklistAdd && (
                <>
                  <div className={s.titleWrap}>
                    <ChecklistIcon />
                    <p className={s.title}>Чек-лист</p>
                  </div>
                  <Checklist />
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
                    <AddCheclistIcon />
                    <input
                      type="file"
                      className={s.inputFile}
                      onChange={handleUploadFile}
                    />
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
            <div>
              <div className={s.titleWrap}>
                {/* <AddCheclistIcon /> */}
                Добавить на карточку
              </div>
              <div className={s.btnsWrap}>
                <button
                  className={s.addButton}
                  onClick={handleAddChecklistToCard}
                >
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
  );
};

export default CardModal;
