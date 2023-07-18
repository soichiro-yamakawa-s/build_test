import { all, fork } from 'redux-saga/effects';
import * as appSaga from './saga/appSaga';
import * as analystSaga from './saga/analystSaga';
import * as publicInfoSaga from './saga/publicInfoSaga';

export default function* rootSaga() {
  yield all([
    ...Object.values(appSaga),
    ...Object.values(analystSaga),
    ...Object.values(publicInfoSaga)
  ].map(fork))
}