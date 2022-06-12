import { render } from '@testing-library/react';
import Comments, { CommentsProps } from '../Comments';
import { User } from '../../../interfaces/user';
import { comments } from '../../../mocks/comments';

describe('<Comment />', () => {
  const props: CommentsProps = {
    cardId: 1,
    columnId: 1,
    data: [],
    updateCard: jest.fn(),
  };

  it('should not render comments', () => {
    const { queryByTestId } = render(<Comments {...props} data={[]} />);
    expect(queryByTestId('comment')).not.toBeInTheDocument();
  });

  it('should render one comment', () => {
    const { getAllByTestId } = render(<Comments {...props} data={[comments[0]]} />);
    expect(getAllByTestId('comment')).toHaveLength(1);
  });

  it('should render right count of comments', () => {
    const { getAllByTestId } = render(<Comments {...props} data={comments} />);
    expect(getAllByTestId('comment')).toHaveLength(comments.length);
  });
});
