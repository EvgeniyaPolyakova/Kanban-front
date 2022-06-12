import { getByTestId, render } from '@testing-library/react';
import Checklist, { ChecklistProps } from '../Checklist';
import { tasks } from '../../../mocks/tasks';

describe('<Checklist />', () => {
  const props: ChecklistProps = {
    cardId: 1,
    columnId: 1,
    data: [],
    deleteFromCard: jest.fn(),
    updateCard: jest.fn(),
  };

  it('should not render task', () => {
    const { getByTestId, queryByTestId } = render(<Checklist {...props} data={[]} />);
    expect(queryByTestId('checklist-task')).not.toBeInTheDocument();
    expect(getByTestId('checklist-progress')).toHaveTextContent('0%');
  });

  it('should render one task', () => {
    const { getByTestId, getAllByTestId } = render(<Checklist {...props} data={[tasks[0]]} />);
    expect(getAllByTestId('checklist-task')).toHaveLength(1);
    if (tasks[0].isChecked) {
      expect(getByTestId('checklist-progress')).toHaveTextContent('100%');
    } else {
      expect(getByTestId('checklist-progress')).toHaveTextContent('0%');
    }
  });

  it('should render right count of tasks', () => {
    const { getByTestId, getAllByTestId } = render(<Checklist {...props} data={tasks} />);
    expect(getAllByTestId('checklist-task')).toHaveLength(tasks.length);
    expect(getByTestId('checklist-progress')).toHaveTextContent('50%');
  });
});
