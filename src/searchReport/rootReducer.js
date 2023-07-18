import { combineReducers } from 'redux-starter-kit'
import appModule from './modules/appModule'
import analystModule from './modules/analystModule'
import publicInfoModule from './modules/publicInfoModule'

const rootReducer = combineReducers({
  app: appModule.reducer,
  analyst: analystModule.reducer,
  publicInfo: publicInfoModule.reducer
})

export default rootReducer