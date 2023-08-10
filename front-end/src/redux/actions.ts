import * as actionTypes from './actionTypes';

export interface StudentData {
    id: number;
    name: string;
    gender: string;
    address: string;
    dob: string;
    age: number;
  }

export const createStudent = (studentData: StudentData) => ({
    type: actionTypes.CREATE_STUDENT,
    payload: studentData,
});

export const getStudents = () => ({
    type: actionTypes.GET_STUDENTS,
  });

  export const updateStudent = (studentId: number, updatedData:StudentData) => ({
    type: actionTypes.UPDATE_STUDENT,
    payload: {
      id: studentId,
      data: updatedData,
    },
  });

  export const deleteStudent = (studentId: number) => ({
    type: actionTypes.DELETE_STUDENT,
    payload: studentId,
  });