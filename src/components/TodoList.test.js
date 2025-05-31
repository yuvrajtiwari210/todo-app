// src/components/TodoList.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import TodoList from './TodoList';
import '@testing-library/jest-dom';

test('adds a new task and displays it', () => {
  render(<TodoList />);

  const input = screen.getByPlaceholderText(/Add a new task…/i);
  const addButton = screen.getByText('Add');

  // Ensure no tasks initially
  expect(screen.getByText(/No tasks to display\./i)).toBeInTheDocument();

  // Type a new task and add
  fireEvent.change(input, { target: { value: 'Write tests' } });
  fireEvent.click(addButton);

  // Now the “No tasks” message should be gone; the new task should appear:
  expect(screen.queryByText(/No tasks to display\./i)).toBeNull();
  expect(screen.getByText('Write tests')).toBeInTheDocument();
});
