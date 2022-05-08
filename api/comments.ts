import { AxiosResponse } from 'axios';
import { Comment } from '../interfaces/card';
import { CommentDto } from './dto/commentDto';
import makeRequest from './makeRequest';

export const saveComment = (data: CommentDto): Promise<AxiosResponse<Comment>> => {
  return makeRequest.post('/comments/send-comment', {
    userId: data.userId,
    cardId: data.cardId,
    text: data.text,
  });
};

// export const getColumns = (deskId: number): Promise<AxiosResponse<DeskColumn[]>> => {
//   return makeRequest.get(`/columns/get-columns/${deskId}`);
// };
