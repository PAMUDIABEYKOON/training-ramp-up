import axios from 'axios';
import { Student } from '../interfaces';

export const getStudentsFromApi = async () => {
    try {
        const response = await axios.get('http://localhost:3001/students');
        console.log('I am here 1')
        return response.data as Student[];
    } catch (error) {
        throw error;
    }
};

// export const deleteStudentFromApi = async (studentId: number) => {
//     try {
//         const response = await axios.delete(`http://localhost:3000/students/${studentId}`);
//         return response.data as Student[];
//     } catch (error) {
//         throw error;
//     }
// };