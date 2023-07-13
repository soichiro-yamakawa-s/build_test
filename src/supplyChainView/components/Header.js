import { Component, useState, useEffect, useRef } from 'react';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { lifecycle } from 'recompose'
import { FaArrowLeft , FaArrowRight } from 'react-icons/fa';

import * as FilterComponent from './Filter'


// ----- initial state --- 
export const initialState = {
    quote: "7203",
    fontFamily: "'Meiryo', sans-serif",
    power: 0.05,
    historyCount: ""

};

// ---- type ----- 

export const types = {
    FETCH_DATA: 'FETCH_DATA',
    CHANGE_TEXT: 'CHANGE_TEXT',
    INIT_DATA_SETUP: 'INIT_DATA_SETUP',
    FETCH_DATA_TREE: 'FETCH_DATA_TREE',
    SELECT_POWER: 'SELECT_POWER',
    HISTORY: "HISTORY",
    COUNT_RESET: "COUNT_RESET"
};


// ---- action ----- 

export const actions = {
    enterUpdate(tabState) {
        if(tabState == 2 || tabState == 3){
            return { type: types.FETCH_DATA_TREE}
        } else {
            return { type: types.FETCH_DATA}
        }
    },
    chageText(value){
        return { type: types.CHANGE_TEXT , payload: value}
    },
    history(value){
        return { type: types.HISTORY , payload: value}
    }
}

// ---- reducer ----- 

export function reducer(state = initialState, action) {
    const payload = action.payload;
    switch (action.type) {
        case types.SELECT_POWER:
            return { ...state , power: payload}
        case types.CHANGE_TEXT:
            return { ...state , quote: payload}
        case types.HISTORY:
            return { ...state , historyCount: payload}
        case types.COUNT_RESET:
            return { ...state , historyCount: ""}
        default:
            return state
    }
}




// ---- Component ----
export const Header = ({ actions  , quote , tabState, fontFamily , zoom, history, historyCount}) => {
    return (
        <div className="header">
            {<style jsx global>{`
                .header {
                    width: 100%;
                    max-width: 100%;
                    height: 56px;
                    background: black;
                    display: flex;
                    min-width: 1100px;
                    font-family: ${fontFamily} !important;
                }
                .header-sub {
                    top:0;
                    min-width 480px;
                    height: 56px;
                    background: black;
                    display: flex;
                }
                .textbox {
                    font-size: 20px;
                    background: #fff;
                    border: none;
                    width: 173px;
                    height: 40px;
                    line-height: 40px;
                    padding-top: 0px;
                    padding-bottom: 0px;
                    padding-left: 8px;
                    margin-top: 8px;
                    margin-bottom: 4px;
                    margin-left: 40px;
                    margin-right: 20px;
                    font-family: ${fontFamily} !important;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .back-next{
                    // font-size: 30px;
                    font-size: 16px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    -moz-border-radius: 50%;
                    -webkit-border-radius: 50%;
                    padding: 2px 0px 0px 0px;
                    color: white;
                    cursor: pointer;
                    margin-top: 12px;
                    margin-right: 12px;
                    border: none;
                    background-color: black;
                    outline: none;
                }
                .back-next:hover{
                    background-color: #333;
                }
                .back-next:active{
                    opacity: 0.8;
                }
                .back-next-disabled{
                    font-size: 16px;
                    width: 32px;
                    height: 32px;
                    padding: 2px 0px 0px 0px;
                    color: white;
                    opacity: 0.5;
                    cursor: default;
                    margin-top: 12px;
                    margin-right: 12px;
                    border: none;
                    background-color: black;
                    border-radius: 50%;
                    -moz-border-radius: 50%;
                    -webkit-border-radius: 50%;
                    outline: none;
                }          
            `}</style>}
            <div className="header-sub">
            <input type="text" className="textbox" value={quote} 
                    onChange={(e) => actions.chageText(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.charCode === 13) {
                            actions.enterUpdate(tabState)
                            e.preventDefault();
                        }
                      }}
                />
            <button className={history.length < 2 || historyCount === 0 ? "back-next-disabled" : "back-next"} 
                    disabled={history.length < 2 || historyCount === 0 ? true : false}
                    onClick={() => {
                        historyCount = historyCount == "" ? history.length - 2 : historyCount - 1  
                        actions.history(historyCount)
                     }}
            ><FaArrowLeft size={20} /></button>
            <button className={historyCount === "" || history.length - 1 === historyCount ? "back-next-disabled" :"back-next"} 
                    disabled={historyCount === "" || history.length - 1  === historyCount ? true : false}
                    onClick={() => {
                        historyCount = historyCount + 1  
                        actions.history(historyCount)
                     }}
            ><FaArrowRight size={20} /></button>
            
            </div>
        <FilterComponent.view />

        </div>
    )
}

const initApp = lifecycle({
    componentDidMount() {
      this.props.initApp()
    }
  })(Header)

const mapStateToProps = (state) => ({
    quote: state.Header.quote,
    tabState: state.Tab.tabState,
    fontFamily: state.Header.fontFamily,
    history: state.Force.history,
    historyCount: state.Header.historyCount,
})

const mapDispatchToProps = (dispatch) => ({
    initApp: () => dispatch({type: types.INIT_DATA_SETUP}),
    actions: bindActionCreators(actions, dispatch),
})

const view = connect(mapStateToProps, mapDispatchToProps)(initApp)
export { view }

