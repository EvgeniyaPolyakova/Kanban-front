import Button from '../Button';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('<Button />', () => {
  it('should render', () => {
    const { getByText } = render(<Button>test</Button>);
    expect(getByText('test')).toBeInTheDocument();
  });
});
