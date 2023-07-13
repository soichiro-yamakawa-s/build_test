import { Component, useState, useEffect, useRef } from 'react';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FaSearchPlus, FaSearchMinus } from 'react-icons/fa';

const hierarchyList = ["30", "50", "80", "全"]

// ----- initial state --- 
export const initialState = {
    hierarchy: hierarchyList[1],
};

// ---- type ----- 

export const types = {
    CHANGE_HIERARCHY: 'CHANGE_HIERARCHY',
    CHANGE_HIERARCHY_ONLY: 'CHANGE_HIERARCHY_ONLY'
};


// ---- action ----- 

export const actions = {
    changeHierarchy(value) {
        return { type: types.CHANGE_HIERARCHY, payload: value }
    }
}

// ---- reducer ----- 

export function reducer(state = initialState, action) {
    const payload = action.payload;
    switch (action.type) {
        case types.CHANGE_HIERARCHY:
            return { ...state, hierarchy: payload }
        case types.CHANGE_HIERARCHY_ONLY:
            return { ...state, hierarchy: payload }
        default:
            return state
    }
}




// ---- Component ----
export const Hierarchy = ({ actions, tabState, fontFamily, zoom, hierarchy }) => {
    return (
        <div className="hierarchy">
            {<style jsx global>{`
                .hierarchy{
                    font-size: 12px;
                    width: 100%;
                    min-width: 1100px;
                    color: #707070;
                    font-family: ${fontFamily} !important;
                }
                .hierarchy_div{
                    display: flex;
                    margin-top: 8px;
                    margin-bottom: 8px;
                }
                .hierarchy_span{
                    font-size: 20px;
                    margin-right: 28px;
                }
                .hierarchy_select{
                    width: 100px;
                    height: 28px;
                    padding-left: 36px;
                    font-size: 20px;
                    margin-left: auto;
                    margin-right: 8px;
                    z-index: 0;
                    font-family: ${fontFamily} !important;
                    background-color: transparent;
                    border-radius: 0;
                    border: none;
                    border-bottom: 1px solid #707070 !important;
                    color: #707070;
                    cursor: pointer;
                    outline: none;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                }
                .hierarchy_select::-ms-expand{
                    display: none;
                }
                .hierarchy_select::-ms-value{
                    background: none;
                    color: #707070;
                }
                .hierarchy_comment{
                    display: flex;
                    font-size: 12px;
                }
                .comment{
                    margin-left: auto;
                    margin-right: 28px;
                }
                .zoom-scale{
                    display: flex;
                    margin-top: 
                    width: 100%;
                    font-size: 20px;
                }
            `}</style>}
            {tabState == "0" || tabState == "1"
                ? <div>
                    <div className="zoom-scale">
                        <span className="comment">{100 <= zoom ? <FaSearchPlus size={16} /> : <FaSearchMinus size={16} />} {zoom}%</span>
                    </div>
                    <div className="hierarchy_div">

                        <select className="hierarchy_select" value={hierarchy} onChange={(e) => actions.changeHierarchy(e.target.value)}>
                            {hierarchyList.map((value, i) => {
                                return i == 1 ? <option value={value} selected key={i}>{value}</option> : <option value={value} key={i}>{value}</option>
                            })}
                        </select>
                        <span className="hierarchy_span">社</span>
                    </div>
                    <div className="hierarchy_comment">
                        <span className="comment">一つの点から繋がる関連会社の最大表示数</span>
                    </div>
                    <div className="hierarchy_comment">
                        <span className="comment">※全にすると重い可能性があります</span>
                    </div>
                </div>
                : ""}
        </div>
    )
}



const mapStateToProps = (state) => ({
    hierarchy: state.Hierarchy.hierarchy,
    tabState: state.Tab.tabState,
    fontFamily: state.Header.fontFamily,
    zoom: state.Force.zoom
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
})

const view = connect(mapStateToProps, mapDispatchToProps)(Hierarchy)
export { view }

