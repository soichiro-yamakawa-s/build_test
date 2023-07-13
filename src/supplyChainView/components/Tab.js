import { Component, useState, useEffect, useRef } from 'react';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import * as ForceComponent from './Force'
import * as Force2Component from './Force2'
import * as TreeComponent from './Tree'
import * as TableComponent from './Table'

// ----- initial state --- 
export const initialState = {
    tabState: 0,
    sc: "S"
};

// ---- type ----- 

export const types = {
    CHANGE_TAB: 'CHANGE_TAB',
    CHANGE_TAB_DATA: 'CHANGE_TAB_DATA',
    CHNAGE_TAB_HISTORY: 'CHNAGE_TAB_HISTORY'
};


// ---- action ----- 

export const actions = {
    setState(value) {
        return { type: types.CHANGE_TAB, payload: value.tabState }
    },
    updateSC(value) {
        return { type: types.CHANGE_TAB_DATA, payload: value }
    },
    changeTab(tabState, filterType, country, rbics, hierarchy) {
        return { type: types.CHNAGE_TAB_HISTORY, payload: { "quote": "", "entity": "", "name": "", "sc": "", "filterType": filterType, "country": country, "rbics": rbics, "hierarchy": hierarchy, "tabState": tabState } }
    }

}

// ---- reducer ----- 

export function reducer(state = initialState, action) {
    const payload = action.payload;
    switch (action.type) {
        case types.CHANGE_TAB_DATA:
            return { ...state, sc: payload }
        case types.CHANGE_TAB:
            return { ...state, tabState: payload }
        default:
            return state
    }
}




// ---- Component ----

const ChartTab = ({ actions, tabState, fontFamily, filterType, country, rbics, hierarchy }) => {
    return (
        <div className="tab">
            {<style jsx global>{`
             .tab {
                 position: flex;
                 text-align: center;
                height: 48px;
                min-width: 1100px;
                font-family: ${fontFamily} !important;
                }
              .react-tabs__tab-list{
                min-width: 400px;
                margin: 0px 16px 0px 16px;
                border-bottom: solid 1px #707070;
                background-color: #fff;
                height: 48px;
              }
             .chartTab{
                 cursor: pointer;
                 font-size: 20px;
                 display: inline-block;
                 margin-right: 22px;
                 color: #707070;
                 margin-top: 16px;
                 padding: 0px;
                 height: 30px;
                 outline: none;
             }
             .chartTab:hover{
                //  background: #2A5B8C;
                color: #707070;
                font-weight: bold;
             }
             .chartTab-selected{
                cursor: default;
                color: #707070;
                font-size: 20px;
                padding: 0px;
                display: inline-block;
                height: 30px;
                margin-top: 16px;
                margin-right: 22px;
                border-bottom: 5px solid #555;
                font-weight: bold;
                outline: none;
            }
            
             .chartName {
                 vertical-align: middle;
             }
         `}</style>}
            <Tabs selectedIndex={tabState} onSelect={tabState => actions.setState({ tabState })}>
                <TabList>
                    <Tab className={tabState === 0 ? "chartTab-selected" : "chartTab"} onClick={() => {
                        actions.updateSC("S")
                        actions.changeTab(0 , filterType, country, rbics, hierarchy)
                    }}>サプライヤー</Tab>
                    <Tab className={tabState === 1 ? "chartTab-selected" : "chartTab"} onClick={() => {
                        actions.updateSC("C")
                        actions.changeTab(1, filterType, country, rbics, hierarchy)
                    }}>カスタマー</Tab>
                    <Tab className={tabState === 2 ? "chartTab-selected" : "chartTab"} onClick={() => {
                        actions.changeTab(2, filterType, country, rbics, hierarchy)
                    }}>ツリー表示</Tab>
                    <Tab className={tabState === 3 ? "chartTab-selected" : "chartTab"} onClick={() => {
                        actions.changeTab(3, filterType, country, rbics, hierarchy)
                    }}>リスト表示</Tab>
                </TabList>
                <TabPanel>
                    <ForceComponent.view />
                </TabPanel>
                <TabPanel>
                    <Force2Component.view />
                </TabPanel>
                <TabPanel>
                    <TreeComponent.view />
                </TabPanel>
                <TabPanel>
                    <TableComponent.view />
                </TabPanel>

            </Tabs>
        </div>
    );
}


const mapStateToProps = (state) => ({
    tabState: state.Tab.tabState,
    fontSize: state.Header.fontSize,
    fontFamily: state.Header.fontFamily,
    filterType: state.Filter.filterType,
    country: state.Filter.country,
    rbics: state.Filter.rbics,
    hierarchy: state.Hierarchy.hierarchy
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
})

const view = connect(mapStateToProps, mapDispatchToProps)(ChartTab)
export { view }

