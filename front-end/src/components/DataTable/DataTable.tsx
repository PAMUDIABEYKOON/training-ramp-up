import { Alert, AlertProps, Button, Grid } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridToolbarContainer,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  setRowModesModel,
  setRows,
  updateStudent,
} from '../../redux/slice';
import { useEffect } from 'react';
import { Student } from '../../redux/slice';
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

const EditToolbar = (props: EditToolbarProps) => {
  const dispatch = useDispatch();
  const rows = useSelector((state: any) => state.data.records);
  const rowModesModel = useSelector((state: any) => state.data.rowModesModel);
  const userRole = useSelector((state: any) => state.user.userRole);

  const isAddDisabled = userRole === 'user';

  const handleAddClick = () => {
    const id = 0;
    const newRow = {
      id,
      name: '',
      gender: '',
      address: '',
      mobile: '',
      dateOfBirth: '',
      age: '',
      isNew: true,
    };

    dispatch(setRows([newRow, ...rows]));

    dispatch(
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }),
    );
  };

  return (
    <GridToolbarContainer>
      <Button
        color="primary"
        onClick={handleAddClick}
        disabled={isAddDisabled}
        sx={{ display: 'flex', justifyContent: 'flex-start' }}
      >
        Add New
      </Button>
    </GridToolbarContainer>
  );
};

export const DataTable = () => {
  const dispatch = useDispatch();
  const rows = useSelector((state: any) => state.data.records);
  const rowModesModel = useSelector((state: any) => state.data.rowModesModel);
  const userRole = useSelector((state: any) => state.user.userRole);

  const isEditDisabled = userRole === 'user';
  const isDeleteDisabled = userRole === 'user';

  useEffect(() => {
    dispatch(getAllStudents());
  }, [dispatch]);

  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    dispatch(
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } }),
    );
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    const studentId = Number(id);
    dispatch(deleteStudent(studentId));
    socket.on('studentDeleted', (msg) => {
      setSnackbar({ children: msg, severity: 'success' });
    });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    dispatch(
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      }),
    );
    const editedRow = rows.find((row: { id: GridRowId }) => row.id === id);
    if (editedRow!.isNew) {
      dispatch(setRows(rows.filter((row: { id: GridRowId }) => row.id !== id)));
    }
  };

  const handleSaveClick = (id: GridRowId) => () => {
    dispatch(
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } }),
    );
  };

  const processRowUpdate = (
    newRow: GridRowModel,
  ): GridValidRowModel | Promise<GridValidRowModel> => {
    let existingRow = rows.find((row: GridRowModel) => row.id === newRow.id);

    let validated = false;
    const today = new Date();

    const dob = new Date(newRow.dob);
    let newAge: number | string = '';
    newAge = today.getFullYear() - dob.getFullYear();

    if (newRow.name.trim() === '') {
      setSnackbar({ children: 'Please fill name', severity: 'error' });
    } else if (newRow.gender.trim() === '') {
      setSnackbar({ children: 'Please select gender', severity: 'error' });
    } else if (newRow.address.trim() === '') {
      setSnackbar({ children: 'Please fill address', severity: 'error' });
    } else if (
      typeof newRow.mobile === 'string' &&
      newRow.mobile.trim() === ''
    ) {
      setSnackbar({ children: 'Please fill mobile', severity: 'error' });
    } else if (!/^\d{10}$/.test(newRow.mobile)) {
      setSnackbar({
        children: 'Please add a valid mobile number with 10 digits',
        severity: 'error',
      });
    } else if (isNaN(newRow.dob)) {
      setSnackbar({ children: 'Please fill date of birth', severity: 'error' });
    } else if (newAge < 18) {
      setSnackbar({
        children: 'Age must be above 18. Add birth of date again',
        severity: 'error',
      });
    } else {
      validated = true;
    }

    if (!validated) {
      dispatch(
        setRowModesModel({
          ...rowModesModel,
          [existingRow.id]: { mode: GridRowModes.Edit },
        }),
      );
    }

    const updatedRow: Student = {
      ...existingRow,
      name: newRow.name,
      gender: newRow.gender,
      address: newRow.address,
      mobile: newRow.mobile,
      dob: newRow.dob,
      age: today.getFullYear() - newRow.dob.getFullYear(),
    };

    if (validated) {
      if (newRow.isNew) {
        dispatch(createStudent(updatedRow));
        socket.on('studentAdded', (msg) => {
          setSnackbar({ children: msg, severity: 'success' });
        });
        dispatch(
          setRows(rows.filter((row: { id: any }) => row.id !== newRow.id)),
        );
      } else {
        dispatch(updateStudent({ id: updatedRow.id, data: updatedRow }));
        socket.on('studentUpdated', (msg) => {
          setSnackbar({ children: msg, severity: 'success' });
        });
      }
    }

    return updatedRow;
  };

  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    setSnackbar({ children: error.message, severity: 'error' });
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Male', 'Female'],
    },
    { field: 'address', headerName: 'Address', width: 150, editable: true },
    {
      field: 'mobile',
      headerName: 'Mobile No',
      width: 150,
      editable: true,
    },
    {
      field: 'dob',
      headerName: 'Date of Birth',
      width: 150,
      editable: true,
      type: 'date',
      valueGetter: (params) => {
        const dateOfBirthStr = params.value;
        const dateOfBirth = new Date(dateOfBirthStr);
        return dateOfBirth;
      },
    },
    {
      field: 'age',
      headerName: 'Age',
      width: 150,
      valueGetter: (params) => {
        const dob = new Date(params.row.dob);
        const today = new Date();
        let age: number | string = '';
        if (!params.row.isNew) {
          age = today.getFullYear() - dob.getFullYear();
        }
        return age;
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 200,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <Button
              aria-label="save"
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleSaveClick(id)()}
            >
              Save
            </Button>,
            <Button
              aria-label="cancel"
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleCancelClick(id)}
            >
              Cancel
            </Button>,
          ];
        } else {
          return [
            <Button
              aria-label="edit"
              variant="contained"
              color="error"
              size="small"
              onClick={handleEditClick(id)}
              disabled={isEditDisabled}
            >
              Edit
            </Button>,
            <Button
              aria-label="delete"
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleDeleteClick(id)}
              disabled={isDeleteDisabled}
            >
              Delete
            </Button>,
          ];
        }
      },
    },
  ];

  return (
    <Grid>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        disableVirtualization
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      ></DataGrid>
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Grid>
  );
};
