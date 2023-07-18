import { createSlice } from 'redux-starter-kit';
import sub from 'date-fns/sub';

const analystModule = createSlice({
  name: 'analyst',
  initialState: {
    ui: {
      language: 2,
      kikan: 1,
      term: 4,
      rangeType: 1,
      startDate: sub(new Date(), { days: 7 }),
      endDate: new Date()
    },
    nextFetchParams: {
      lastExactData: '',
      newsIDList: '',
      nextData: ''
    },
    dialog: { 
      repo: false, 
      industory: false,
      fromco: false
    },
    filterDialog: false,
    currentFilterDialogState: {},
    displayText: [],
    disabled: {
      Back: true,
      Foward: true
    },
    page: 0,
    record: {},
    params: [],
    astKey: null,
    loading: true,
    pageParamsLoaded: false
  },
  reducers: {
    toggleMore: (state, action) => {
      const index = action.payload.index;
      const page = action.payload.page;
      state.record[page][index].more = action.payload.value;
    },
    setIndividualRowSize: (state, action) => {
      const page = action.payload.page;
      const index = action.payload.index;
      state.record[page][index].height = action.payload.value;
    },
    handleDisplay: (state, action) => {
      const checked = action.payload.checked;
      for (let page in state.record) {
        state.record[page].forEach(item => item.height = checked === true ? item.height : 50);
      }
    },
    toggleLoading: (state, action) => {
      state.loading = action.payload;
    },
    setRecord: (state, action) => {
      if (!state.record[action.payload.page]) {
        state.record[action.payload.page] = action.payload.record;
        state.nextFetchParams = action.payload.nextFetchParams;
      } else if (action.payload.type === "new") {
        state.record = {};
        state.record[0] = action.payload.record;
        state.nextFetchParams = action.payload.nextFetchParams;
      }

      const totalPage = Object.keys(state.record).length;
      state.page = action.payload.page;

      if (state.page > 0) {
        state.disabled.Back = false;
      } else {
        state.disabled.Back = true;
      }
      if (state.nextFetchParams.nextData === "1") {
        state.disabled.Foward = false;
      } else {
        if (state.page < totalPage - 1) {
          state.disabled.Foward = false;
        } else {
          state.disabled.Foward = true;
        }
      }

      state.loading = false;
    },
    setParams: (state, action) => {
      return ({
        ...state,
        params: action.payload
      })
    },
    setKeys: (state, action) => {
      return ({
        ...state,
        astKey: action.payload
      })
    },
    handleDialogOnChange: (state, action) => {
      state.currentFilterDialogState.ui[action.payload.key] = action.payload.value
    },
    detail: (state, action) => {
      const page = action.payload.page;
      const index = action.payload.index;
      if (state.record[page][index]) {
        state.record[page][index].detail = action.payload.body;
      }
    },
    detailStatus: (state, action) => {
      const page = action.payload.page;
      const index = action.payload.index;
      if (state.record[page][index]) {
        state.record[page][index].load = action.payload.loading;
      }
    },
    toggleDialog: (state, action) => {
      state.dialog[action.payload.key] = action.payload.value
    },
    setCurrentFilterDialogContent: (state, action) => {
      state.currentFilterDialogState.params = state.params;
      state.currentFilterDialogState.ui = state.ui;
    },
    saveFilterDialogSettings: (state, action) => {
      state.params = state.currentFilterDialogState.params;
      state.ui = state.currentFilterDialogState.ui;
    },
    setFilterTextDisplay: (state, action) => {
      state.displayText = action.payload.value;
    },
    toggleFilterDialog: (state, action) => {
      state.filterDialog = action.payload.value
    },
    clearChecklistChecked: (state, action) => {
      state.currentFilterDialogState.params[action.payload.mode].forEach(obj => {
        obj.checked = false;
      })
    },
    toggleChecklistChecked: (state, action) => {
      state.currentFilterDialogState.params[action.payload.mode].forEach(obj => {
        if (obj.id == action.payload.id) {
          obj.checked = action.payload.checked;
        }
      })
    },
    toggleLoading: (state, action) => {
      state.loading = action.payload;
    },
    setParamsLoaded: (state, action) => {
      state.pageParamsLoaded = action.payload;
    },
    reset: (state, action) => {
      for(let mode in state.params) {
        state.params[mode].forEach(element => {
          element['checked'] = false;
        });
      }
      state.ui.language = 2;
      state.ui.kikan = 1;
      state.ui.term = 4;
      state.ui.rangeType = 1;
      state.ui.startDate = sub(new Date(), { days: 7 });
      state.ui.endDate = new Date();
    }
  }
});

export default analystModule