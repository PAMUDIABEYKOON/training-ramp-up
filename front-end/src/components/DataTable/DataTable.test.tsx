import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import { DataTable } from './DataTable';

test('display the initial rows correctly', () => {
  render(
    <Provider store={store}>
      <DataTable />
    </Provider>,
  );

  
  expect(screen.getByText('Ted')).toBeInTheDocument();
  expect(screen.getByText('Rachel')).toBeInTheDocument();
  expect(screen.getByText('Justin')).toBeInTheDocument();
  expect(screen.getByText('Emma')).toBeInTheDocument();
});

test('"Delete" button and its functionality: removes a row', () => {
  render(
    <Provider store={store}>
      <DataTable />
    </Provider>,
  );

  const rowToDelete = screen.getByRole('row', { name: /Ted/i });
  expect(rowToDelete).toBeInTheDocument();
  const deleteButton = screen.getAllByRole('button', { name: /delete/i });
  fireEvent.click(deleteButton[0]);
  expect(rowToDelete).not.toBeInTheDocument();
});

test('"Edit" button and its functionality: changes the value of an existing row', () => {
  render(
    <Provider store={store}>
      <DataTable />
    </Provider>,
  );

  const rowToEdit = screen.getByRole('row', { name: /Ted/i });
  expect(rowToEdit).toBeInTheDocument();
  const editButton = screen.getAllByRole('button', { name: /edit/i });
  fireEvent.click(editButton[0]);

  const nameCell = screen.getAllByRole('cell', { name: 'Ted' });
  nameCell[0].textContent = 'James';

  const saveButton = screen.getAllByRole('button', { name: /save/i });
  expect(saveButton[0]).toBeInTheDocument();
});

test('"Save" button and its functionality: shows the changes after saving the row', async () => {
  render(
    <Provider store={store}>
      <DataTable />
    </Provider>,
  );

  const editButton = screen.getAllByRole('button', { name: /edit/i });
  fireEvent.click(editButton[0]);

  const newAddress = screen.getAllByRole('textbox')[0];
  fireEvent.change(newAddress, { target: { value: 'Melbourne' } });

  const saveButton = screen.getAllByRole('button', { name: /save/i });
  expect(saveButton[0]).toBeInTheDocument();
  fireEvent.click(saveButton[0]);

  await waitFor(() => {
    const updatedRow = screen.getByText('Melbourne');
    expect(updatedRow).toBeInTheDocument();
  });
});

test('"Cancel" button and its functionality', () => {
  render(
    <Provider store={store}>
      <DataTable />
    </Provider>,
  );

  const rowToEdit = screen.getByRole('row', { name: /Rachel/i });
  expect(rowToEdit).toBeInTheDocument();

  const editButton = screen.getAllByRole('button', { name: /edit/i });
  fireEvent.click(editButton[0]);

  const cancelButton = screen.getAllByRole('button', { name: /cancel/i });
  fireEvent.click(cancelButton[0]);
});

test('update the age field correctly', async () => {
  render(
    <Provider store={store}>
      <DataTable />
    </Provider>,
  );

  const editButton = screen.getAllByRole('button', { name: /edit/i });
  fireEvent.click(editButton[0]);

  const newDoB = screen.getAllByRole('textbox')[0];
  fireEvent.change(newDoB, { target: { value: '1980-02-15' } });

  const saveButton = screen.getAllByRole('button', { name: /save/i });
  expect(saveButton[0]).toBeInTheDocument();
  fireEvent.click(saveButton[0]);

  await waitFor(() => {
    const ageField = screen.getByText('33');
    expect(ageField).toBeInTheDocument();
  });
});

test('renders the EditToolbar with the "Add New" button and its functionality', () => {
  render(
    <Provider store={store}>
      <DataTable />
    </Provider>,
  );

  const initialRows = store.getState().data.records;
  const initialRowsCount = initialRows.length;

  const addNewButton = screen.getByRole('button', { name: 'Add New' });
  fireEvent.click(addNewButton);

  const updatedRows = store.getState().data.records;
  const updatedRowsCount = updatedRows.length;

  expect(updatedRowsCount).toBe(initialRowsCount + 1);
});
