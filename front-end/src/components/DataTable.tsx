import { Button, Grid } from '@mui/material';
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
} from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { setRowModesModel, setRows } from '../redux/slice';
import { useEffect } from 'react';
import { generateID } from '../utils/GenerateIds';
import { getStudents } from '../redux/actions';

export const initialRows: GridRowsProp = [
  {
    id: generateID(),
    name: 'Ted',
    gender: 'Male',
    address: 'toronto',
    mobile: '767778984',
    dateOfBirth: new Date('1990-01-05').toString(),
  },
  {
    id: generateID(),
    name: 'Rachel',
    gender: 'Female',
    address: 'sydney',
    mobile: '67778988',
    dateOfBirth: new Date('2000-07-25').toString(),
  },
  {
    id: generateID(),
    name: 'Justin',
    gender: 'Male',
    address: 'Ohio',
    mobile: '767778909',
    dateOfBirth: new Date('2002-03-02').toString(),
  },
  {
    id: generateID(),
    name: 'Emma',
    gender: 'Female',
    address: 'toronto',
    mobile: '767778899',
    dateOfBirth: new Date('1995-01-05').toString(),
  },
];

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
  const handleAddClick = () => {
    const id = generateID();
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

    dispatch(
      setRows([newRow, ...rows]), //add to the begining of the table
    );

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
        sx={{ display: 'flex', justifyContent: 'flex-start' }}
      >
        Add New
      </Button>
    </GridToolbarContainer>
  );
};

export const DataTable = () => {
  const dispatch = useDispatch();
  //const deletionSuccess = useSelector((state: any) => state.data.deletionSuccess);
  const rows = useSelector((state: any) => state.data.records);
  const rowModesModel = useSelector((state: any) => state.data.rowModesModel);

  //api call get list
  useEffect(() => {
    dispatch(getStudents());
  }, [dispatch]);


  // useEffect(() => {
  //   dispatch(setRows(initialRows));
  // }, [dispatch]);

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

  const handleSaveClick = (id: GridRowId) => async () => {
    // try {
    //   const updatedStudentData = {}; // Replace with the actual updated data
    // // Dispatch the updateStudent action with the studentId and updated data
    // await dispatch(updateStudent(Number(id), updatedStudentData));
    // dispatch(
    //   setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } }),
    // );
    // } catch (error) {
    //   console.error('Error updating student', error);
    // }
    
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    // try {
    //   const studentId = Number(id); // Convert id to number
    //   await dispatch(deleteStudent(studentId));
    //   if (deletionSuccess) {
    //     dispatch(setRows(rows.filter((row: { id: GridRowId }) => row.id !== id)));
    //     dispatch(setDeletionSuccess(false));
    //   } 
    // } catch (error) {
    //   console.error('Error deleting student', error);
    // }
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

  const processRowUpdate = (newRow: GridRowModel) => {
    let updatedRow = rows.find((row: GridRowModel) => row.id === newRow.id);

    if (
      newRow.name.trim() === '' ||
      newRow.gender.trim() === ''  ||
      newRow.address.trim() === '' ||
      newRow.mobile.trim() === ''
    ) {
      alert('Please fill all fields');
    }

    const today = new Date();
    const dob = newRow.dateOfBirth;
    if (dob !== '') {
      const age = today.getFullYear() - dob.getFullYear();
      if (age <= 18) {
        alert('Age must be above 18');
      } else {
        updatedRow = { ...newRow, isNew: false };
        dispatch(
          setRows(
            rows.map((row: GridRowModel) =>
              row.id === newRow.id ? updatedRow : row,
            ),
          ),
        );
      }
    } else {
      alert('Please select the birthday');
    }

    return updatedRow;
  };

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
      field: 'dateOfBirth',
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
        const dob = new Date(params.row.dateOfBirth);
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
              onClick={handleSaveClick(id)}
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
          >
            Edit
          </Button>,
          <Button
            aria-label="delete"
            variant="outlined"
            color="primary"
            size="small"
            onClick={handleDeleteClick(id)}
          >
            Delete
          </Button>,
        ];
      };
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
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      ></DataGrid>
    </Grid>
  );
};
