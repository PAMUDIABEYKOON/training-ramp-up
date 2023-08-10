import { put, takeLatest, call } from 'redux-saga/effects';
import { getStudentsFromApi } from '../api/apiService';
import { getStudentsSuccess } from './slice';
import { Student } from '../interfaces';
 
  function* getStudentsSaga(): Generator<any, void, Student[]> {
    try {
        const fetchedStudents = yield call(getStudentsFromApi);
        //success action
        yield put(getStudentsSuccess(fetchedStudents));

    } catch (error) {
      console.error('Error fetching all students', error);
    }
  }

  // function* updateStudentSaga(action) {
  //   try {
  //     const { id, data } = action.payload;
  
  //     // Make the API call to update the student's data
  //     yield call(updateStudentInApi, id, data);
  
  //     // Dispatch a success action if needed
  //     yield put(updateStudentSuccess(id, data));
  //   } catch (error) {
  //     // Dispatch a failure action if needed
  //     yield put(updateStudentFailure(error.message));
  //   }
  // }

  // function* deleteStudentSaga(action) {
  //   try {
  //     const studentId = action.payload;
  //     yield call(deleteStudentFromApi, studentId);
  //     //success action
  //     yield put({ type: 'DELETE_SUCCESS', payload: true });
  //   } catch (error) {
  //     console.error('Error deleting student', error);
  //     yield put({ type: 'DELETE_SUCCESS', payload: false });
  //   }
  // }
  
  export default function* studentSaga() {
    yield takeLatest('GET_STUDENTS', getStudentsSaga)
    //yield takeLatest('DELETE_STUDENT', deleteStudentSaga)
  }
  