import Avatar from '../Avatar';
import s from './Comments.module.scss';
import { Comment } from '../../interfaces/card';
import Button from '../Button';
import React, { useState } from 'react';

const CommentsArray: Comment[] = [
  {
    id: 1,
    author: 'Сергей Григорьев',
    date: '12.12.2021',
    text: 'Комментарий',
  },
  {
    id: 2,
    author: 'Елена Абрамова',
    date: '13.12.2021',
    text: 'Комментарий 2',
  },
];

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>(CommentsArray);
  const [commentText, setCommentText] = useState<string>('');

  const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setComments(prev => [
      ...prev,
      {
        id: comments.length + 1,
        author: 'Евгения Полякова',
        date: '10.04.2022',
        text: commentText,
      },
    ]);
  };

  return (
    <>
      {comments.map(comment => (
        <div key={comment.id} className={s.commentContainer}>
          <Avatar name={comment.author} />
          <div className={s.commentWrap}>
            <div className={s.authorData}>
              <p className={s.author}>{comment.author}</p>
              <p className={s.date}>{comment.date}</p>
            </div>
            <div className={s.comment}>{comment.text}</div>
          </div>
        </div>
      ))}
      <form className={s.sendForm} onSubmit={handleSendMessage}>
        <Avatar name={'Евгения Полякова'} />
        <div>
          <textarea className={s.textarea} rows={3} onChange={handleChangeComment} value={commentText} />
          <Button type="submit">Отправить</Button>
        </div>
      </form>
    </>
  );
};

export default Comments;
