import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './slice';
import createSagaMiddleware from 'redux-saga';
import studentSaga from './studentSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    data: dataReducer,
  },
  middleware: [sagaMiddleware],
  });

  sagaMiddleware.run(studentSaga);

export default store;
