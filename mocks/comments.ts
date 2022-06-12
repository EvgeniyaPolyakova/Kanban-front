import { Comment } from '../interfaces/card';

export const comments: Comment[] = [
  {
    id: 1,
    author: 'Test Author 1',
    createdAt: '2022-06-12T15:42:11.071Z',
    text: 'Test comment 1',
    users: { id: 1, name: 'Test Name', surname: 'Test Surname' },
  },
  {
    id: 2,
    author: 'Test Author 2',
    createdAt: '2022-06-12T15:42:11.071Z',
    text: 'Test comment 2',
    users: { id: 2, name: 'Test Name', surname: 'Test Surname' },
  },
  {
    id: 3,
    author: 'Test Author 3',
    createdAt: '2022-06-12T15:42:11.071Z',
    text: 'Test comment 3',
    users: { id: 3, name: 'Test Name', surname: 'Test Surname' },
  },
];
