import "@babel/polyfill"
import { Provider } from 'react-redux'
import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import fetch from 'isomorphic-unfetch'
import * as DividendsComponent from '../components/Dividends'
import * as HeaderComponent from '../components/Header'
import * as ContextMenuComponent  from '../components/ContextMenu'
import * as ShowMessageComponent  from '../components/ShowMessage'

import DividendsSaga from '../saga'

const initialState = {
  dividends: DividendsComponent.initialState,
  header: HeaderComponent.initialState,
  ShowMessage: ShowMessageComponent.initialState
}
const rootReducer = combineReducers({
    dividends: DividendsComponent.reducer,
    header: HeaderComponent.reducer,
    ShowMessage: ShowMessageComponent.reducer
})

const sagaMiddleware = createSagaMiddleware()

const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(sagaMiddleware)))
sagaMiddleware.run(DividendsSaga)

const Index = () => (
<div>
    <style jsx global>{`
        body {
            user-select: none;
            font-family: MeiryoKe_Gothic, "Ricty Diminished", "Osaka－等幅", "Osaka-等幅", Osaka-mono, "ＭＳ ゴシック", "MS Gothic", SFMono-Regular, "Courier New", Courier, Monaco, Menlo, Consolas, "Lucida Console", monospace, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }
    `}</style>
    <Provider store={store}>
        <HeaderComponent.view />
        <ContextMenuComponent.view>
            <DividendsComponent.view />
        </ContextMenuComponent.view>
        <ShowMessageComponent.view />

    </Provider>
</div>
)

export default Index