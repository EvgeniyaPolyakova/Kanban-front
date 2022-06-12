import Avatar from '../Avatar';
import s from './Comments.module.scss';
import { CardInterface, Comment } from '../../interfaces/card';
import Button from '../Button';
import React, { useState } from 'react';
import { useUser } from '../../hooks/useUser';
import useLogger from '../../hooks/useLogger';
import { saveComment } from '../../api/comments';
import { getISODate } from '../../helpers/date';

export interface CommentsProps {
  cardId: number;
  columnId: number;
  updateCard: (columnId: number, cardId: number, field: keyof CardInterface, value: any) => void;
  data: Comment[];
}

const Comments = ({ cardId, columnId, updateCard, data }: CommentsProps) => {
  const [commentText, setCommentText] = useState<string>('');
  const { user } = useUser();
  const logger = useLogger();

  const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (user) {
        const { data } = await saveComment({ userId: user.id, cardId: cardId, text: commentText });
        setCommentText('');

        updateCard(columnId, cardId, 'comments', data);
      }
    } catch (err) {
      logger.error(err);
    }
  };

  return (
    <>
      {data.map(comment => (
        <div data-testid="comment" key={comment.id} className={s.commentContainer}>
          <Avatar name={`${comment.users.name} ${comment.users.surname}`} />
          <div className={s.commentWrap}>
            <div className={s.authorData}>
              <p className={s.author}>{`${comment.users.name} ${comment.users.surname}`}</p>
              <p className={s.date}>{getISODate(new Date(comment.createdAt))}</p>
            </div>
            <div className={s.comment}>{comment.text}</div>
          </div>
        </div>
      ))}
      <form className={s.sendForm} onSubmit={handleSendMessage}>
        {user && <Avatar name={`${user.name} ${user.surname}`} />}
        <div>
          <textarea
            className={s.textarea}
            rows={3}
            onChange={handleChangeComment}
            placeholder="Напишите комментарий..."
            value={commentText}
          />
          <Button type="submit" disabled={!commentText}>
            Отправить
          </Button>
        </div>
      </form>
    </>
  );
};

export default Comments;
