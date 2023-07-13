import { Component, useState, useEffect, useRef } from 'react';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { UNIVERSE_SETTING } from '../app.settings'
import { FaRegQuestionCircle } from 'react-icons/fa'

// ----- initial state --- 
const UniverseList = [
    'Nikkei',
    'Topix',
    'Jpx400',
    'JpxMS',
    'TopixCore30',
    'TopixLarge70',
    'Topix100',
    'TopixMid400',
    'Topix500',
    'TopixSmall',
    'Topix1000',
    'TseMothers',
    'TseReit',
    'Nikkei300',
    'Nikkei500'
]
export const initialState = {
    columnCount: "",
    loading: true,
    universe: UniverseList[0]
};

// ---- type ----- 

export const types = {
    CHANGE_UNIVERSE: 'CHANGE_UNIVERSE',
    COLUMN_COUNT: 'UPDATE_COLUMN_COUNT',
    DATA_LOADING: 'DATA_LOADING',
    DOWNLOAD_LINK: 'DOWNLOAD_LINK'
};



// ---- action ----- 

export const actions = {
    changeUniverse(event) {
        return { type: types.CHANGE_UNIVERSE, payload: event.target.value }
    }
}



// ---- reducer ----- 

export function reducer(state = initialState, action) {
    const payload = action.payload;
    switch (action.type) {
        case types.CHANGE_UNIVERSE:
            return { ...state, universe: payload }
        case types.COLUMN_COUNT:
            return { ...state, columnCount: action.payload }
        case types.DATA_LOADING:
            return { ...state, loading: action.payload }
        default:
            return state
    }
}




// ---- Component ----


const Header = ({ universe, actions, columnCount, loading, download }) => {
    return (
        <div className="dividend-header">
            <style jsx global>{`
                .dividend-header {
                    top:0;
                    left:0;
                    margin: 0;
                    width: 1080px;
                    height: 40px;
                    display: flex;
                    background: #003B75;
                }
                .title {
                    position: relative;
                    line-height: 40px;
                    text-align: center;
                    top 0px;
                    left: 16px;
                    font-size: 20px;
                    color: #fff;
                }
                .universe_select {
                    position: relative;
                    left: 32px;
                    top: 4px;
                    height:32px;
                    
                }
                .column_count{
                    position: relative;
                    text-align: center;
                    top: 14px;
                    left: 440px;
                    font-size: 12px;
                    color: #fff;
                }
                .download_link {
                    cursor: ${loading ? "default" : "pointer"};
                    line-height: 40px;
                    text-align: center;
                    top: 10px;
                    margin-left: auto;
                    margin-right: 10px;
                    font-size: 16px;
                    font-family: MeiryoKe_Gothic, "Ricty Diminished", "Osaka－等幅", "Osaka-等幅", Osaka-mono, "ＭＳ ゴシック", "MS Gothic", SFMono-Regular, "Courier New", Courier, Monaco, Menlo, Consolas, "Lucida Console", monospace, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
                    color: #fff;
                    border: none;
                    background: #003B75;
                    outline: none;
                }
                .help-link{
                    color: white;
                    margin-right: 16px;
                    margin-top: 10px;
                }
            `}</style>
            <div className="title">配当金一覧<span>(分割併合調整)</span></div>
            <select className="universe_select" onChange={actions.changeUniverse} value={universe}>
                {UniverseList.map((value, i) => {
                    return <option value={value} key={i}>{UNIVERSE_SETTING[value]}</option>
                })}
            </select>
            <div className="column_count">{loading ? "Loading..." : columnCount.toString() + "件"}</div>
            <button className="download_link" onClick={download} disabled={loading}>Download</button>
            <a className="help-link" target="_blank" href="static/help/dividends_help.pdf"><FaRegQuestionCircle size={20} /></a>
        </div>
    )
}


const mapStateToProps = (state) => ({
    universe: state.header.universe,
    columnCount: state.header.columnCount,
    loading: state.header.loading,
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
    download: () => dispatch({ type: types.DOWNLOAD_LINK })
})

const view = connect(mapStateToProps, mapDispatchToProps)(Header)
export { view }

