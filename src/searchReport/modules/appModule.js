import { createSlice } from 'redux-starter-kit';

const appModule = createSlice({
  name: 'app',
  initialState: {
    loading: true,
    type: 1,
    keyword: '',
    brand: '',
    keywordDisabled: false,
    brandDisabled: false,
    changeDispDisabled: false,
    resetDisabled: false,
    searchLoaded: {
      1: false,
      2: false
    },
    display: {
      display: 'block'
    },
    textDispChecked: true,
    tabsInfo: {},
    pdfSubWindows:[],
    co:''
  },
  reducers: {
    setKeywordDisabled: (state, action) => {
      state.keywordDisabled = true;
    },
    setBrandDisabled: (state, action) => {
      state.brandDisabled = true;
    },
    setChangeDispDisabled: (state, action) => {
      state.changeDispDisabled = true;
    },
    setResetDisabled: (state, action) => {
      state.resetDisabled = true;
    },
    toggleLoading: (state, action) => {
      state.loading = action.payload;
    },
    setTabsInfo: (state, action) => {
      state.tabsInfo = action.payload;
    },
    addPdfSubWindows: (state, action) => {
      state.pdfSubWindows.push(action.payload.value);
    },
    setCo: (state, action) => {
      state.co = action.payload;
    },
    handleOnChange: (state, action) => {
      state[action.payload.key] = action.payload.value;
    },
    setSearchInit: (state, action) => {
      const type = action.payload.type.toString();
      for (let key in state.searchLoaded) {
        state.searchLoaded[key] = type === key ? true : false;
      }
    },
    setSearchLoaded: (state, action) => {
      const type = action.payload.type.toString();
      state.searchLoaded[type] = true;
    },
    handleDisplay: (state, action) => {
      state.display = action.payload.display;
      state.textDispChecked = action.payload.checked;
    },
    reset: (state, action) => {
      state.keyword = '',
      state.brand = '',
      state.display = { display: 'block' },
      state.textDispChecked = true,
      state.searchLoaded = {
        1: false,
        2: false
      }
    }
  }
})

export default appModule