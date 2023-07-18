import { takeLatest, takeEvery, put, select, call } from 'redux-saga/effects';
import Api from '../src/publicInfoApi'

import publicInfoModule from '../modules/publicInfoModule'
import appModule from '../modules/appModule'

export function* paramSaga() {
  yield takeLatest('PUB/PARAM/FETCH', function* getParam() {
    yield put({
      ...publicInfoModule.actions.toggleLoading(),
      payload: true
    });
    const co = yield select(state => state.app.co);
    const {
      astKey,
      settings
    } = yield call(Api.fetchParams, co);
    if (!astKey) {
      yield put({
        ...publicInfoModule.actions.toggleLoading(),
        payload: false
      });
      yield put({
        ...appModule.actions.setTabsInfo(),
        payload: {}
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
      ...publicInfoModule.actions.setKeys(),
      payload: astKey
    });
    yield put({
      ...publicInfoModule.actions.setParams(),
      payload: settings
    });
    yield put({
      ...publicInfoModule.actions.setParamsLoaded(),
      payload: true
    });
    yield put({
      type: 'PUB/RECORD/FETCH',
      payload: {
        page: 0,
        type: 'new'
      }
    })
  })
}

export function* fetchSaga() {
  yield takeLatest('PUB/RECORD/FETCH', function* fetchFunc(p) {
    yield put({
      ...publicInfoModule.actions.toggleLoading(),
      payload: true
    });
    const keyword = yield select(state => state.app.keyword);
    const brand = yield select(state => state.app.brand);
    const astKey = yield select(state => state.publicInfo.astKey);
    const lang = yield select(state => state.publicInfo.ui.language);
    const kikan = yield select(state => state.publicInfo.ui.kikan);
    const rangeType = yield select(state => state.publicInfo.ui.rangeType);
    const startDate = yield select(state => state.publicInfo.ui.startDate);
    const endDate = yield select(state => state.publicInfo.ui.endDate);
    const term = yield select(state => state.publicInfo.ui.term);
    const params = yield select(state => state.publicInfo.params);
    const record = yield select(state => state.publicInfo.record);
    const page = p.payload.page;
    const type = p.payload.type;
    const currentLastExactData = type === "new" ? '' : yield select(state => state.publicInfo.nextFetchParams.lastExactData);
    const currentNewsIDList = type === "new" ? '' : yield select(state => state.publicInfo.nextFetchParams.newsIDList);

    let jnoArray = [];
    let jnoText = [];
    let industoryArray = [];
    let industoryText = [];

    for (let param in params) {
      params[param].map(obj => {
        if (obj.mode === 2 && obj.checked === true) {
          jnoArray.push(obj.id);
          jnoText.push(obj.label);
        } else if (obj.mode === 4 && obj.checked === true) {
          industoryArray.push(obj.id);
          industoryText.push(obj.label);
        }
      })
    }

    const start = [startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate()]
    const end = [endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate()]

    // スペース(半角スペース、全角スペースどちらも)を*に変換する
    let convertedKeyword = keyword.trim();
    convertedKeyword = encodeURIComponent(convertedKeyword.replace(/([\u3000]|\s)+/g, '*'));
    
    const json = {
      'lang': lang,
      'kikan': kikan,
      'rangeType': rangeType,
      'jno': jnoArray,
      'industory': industoryArray,
      'astKey': astKey,
      'currentLastExactData': currentLastExactData,
      'currentNewsIDList': currentNewsIDList,
      'keyword': convertedKeyword,
      'brand': brand
    }

    const displayTextArray = [
      {'2': jnoText},
      {'4': industoryText}
    ]

    if (rangeType === 1 ) {
      json['term'] = term;
    } else {
      json['startDate'] = start;
      json['endDate'] = end;
    }

    yield put({
      ...publicInfoModule.actions.setFilterTextDisplay({ value: displayTextArray })
    })

    if (type === "new" || !record[page]) {
      const {
        responseRecords,
        nextData,
        lastExactData,
        newsIDList
      } = yield call(Api.fetchRecords, json, convertedKeyword, brand);
      if (!responseRecords) {
        yield put({
          ...publicInfoModule.actions.toggleLoading(),
          payload: false
        });
        yield put({
          ...appModule.actions.setTabsInfo(),
          payload: {}
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
        ...publicInfoModule.actions.setRecord(),
        payload: {
          type: type,
          record: responseRecords,
          page: page,
          nextFetchParams: {
            lastExactData: lastExactData,
            newsIDList: newsIDList,
            nextData: nextData
          }
        }
      });
    } else {
      yield put({
        ...publicInfoModule.actions.setRecord(),
        payload: {
          page: page
        }
      })
    };
    yield put({
      ...publicInfoModule.actions.toggleLoading(),
      payload: false
    });
  })
}

export function* loadDetail() {
  yield takeEvery("PUB/DETAIL/FETCH", function* myf(action) {
    const page = action.payload.page;
    const index = action.payload.index;

    yield put({
      ...publicInfoModule.actions.detailStatus(),
      payload: { page: page, index: index, loading: "started" },
    });
    const astKey = yield select((state) => state.publicInfo.astKey);
    const detailRecord = yield call(
      Api.fetchDetails,
      action.payload.url,
      astKey
    );
    yield put({
      ...publicInfoModule.actions.detail(),
      payload: { page: page, index: index, body: detailRecord },
    });
    yield put({
      ...publicInfoModule.actions.detailStatus(),
      payload: { page: page, index: index, loading: "loaded" },
    });
  });
}
