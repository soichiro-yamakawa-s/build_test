import { takeLatest, put, call } from 'redux-saga/effects';
import Api from '../src/appApi';

import appModule from '../modules/appModule';

export function* tabsSaga() {
  yield takeLatest('TABS/FETCH', function* getTabs() {
    yield put({
      ...appModule.actions.toggleLoading(),
      payload: true
    });
    const ticket = yield call(Api.fetchTicket);
    if (!ticket.userId) {
      yield put({
        ...appModule.actions.toggleLoading(),
        payload: false
      });
      yield put({
        ...appModule.actions.setBrandDisabled(),
        payload: {}
      });
      yield put({
        ...appModule.actions.setKeywordDisabled(),
        payload: {}
      });
      yield put({
        ...appModule.actions.setChangeDispDisabled(),
        payload: {}
      });
      yield put({
        ...appModule.actions.setResetDisabled(),
        payload: {}
      });
      alert('本画面は表示されません')
      return;
    }
    const co = yield call(Api.fetchCo, ticket.userId);
    if (!co) {
      yield put({
        ...appModule.actions.toggleLoading(),
        payload: false
      });
      yield put({
        ...appModule.actions.setBrandDisabled(),
        payload: {}
      });
      yield put({
        ...appModule.actions.setKeywordDisabled(),
        payload: {}
      });
      yield put({
        ...appModule.actions.setChangeDispDisabled(),
        payload: {}
      });
      yield put({
        ...appModule.actions.setResetDisabled(),
        payload: {}
      });
      alert('本画面は表示されません')
      return;
    }
    yield put({
      ...appModule.actions.setCo(),
      payload: co
    });
    for (let tab in ticket.tabsInfo) {
      if (ticket.tabsInfo[tab]) {
        yield put({
          ...appModule.actions.handleOnChange({ key: 'type', value: parseInt(tab) }),
        });
        break;
      };
    }
    yield put({
      ...appModule.actions.setTabsInfo(),
      payload: ticket.tabsInfo
    });
    yield put({
      ...appModule.actions.toggleLoading(),
      payload: false
    });
  })
}