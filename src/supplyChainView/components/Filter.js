import { Component, useState, useEffect, useRef } from 'react';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';
import { FaRegQuestionCircle } from 'react-icons/fa';

// ----- initial state --- 
export const initialState = {
    rbics: "業種",
    countryList: [],
    country: "国",
    rbicsList: [],
    filterType: "filter"
};

// ---- type ----- 

export const types = {
    CHANGE_RBICS: 'CHANGE_RBICS',
    CHANGE_RBICS_ONLY: 'CHANGE_RBICS_ONLY',
    CHANGE_RBICS_HIGHLIGHT: 'CHANGE_RBICS_HIGHLIGHT',
    CHANGE_COUNTRY: 'CHANGE_COUNTRY',
    CHANGE_COUNTRY_ONLY: 'CHANGE_COUNTRY_ONLY',
    CHANGE_COUNTRY_HIGHLIGHT: 'CHANGE_COUNTRY_HIGHLIGHT',
    INIT_DATA_SETUP: 'INIT_DATA_SETUP',
    UPDATE_LIST: 'UPDATE_LIST',
    CHANGE_RADIO: 'CHANGE_RADIO',
    CHANGE_RADIO_ONLY: 'CHANGE_RADIO_ONLY',
};


// ---- action ----- 

export const actions = {
    changeRBICS(value, filterType, country, rbics, hierarchy, tabState) {
        return filterType == "highlight" 
        ? { type: types.CHANGE_RBICS_HIGHLIGHT, payload: { "quote": "", "entity": "", "name": "", "sc": "", "filterType": filterType, "country": country, "rbics": value, "hierarchy": hierarchy, "tabState": tabState } } 
        : { type: types.CHANGE_RBICS, payload: value }
    },
    changeCountry(value, filterType, country, rbics, hierarchy, tabState) {
        return filterType == "highlight" 
        ? { type: types.CHANGE_COUNTRY_HIGHLIGHT, payload: { "quote": "", "entity": "", "name": "", "sc": "", "filterType": filterType, "country": value, "rbics": rbics, "hierarchy": hierarchy, "tabState": tabState } } 
        : { type: types.CHANGE_COUNTRY, payload: value }
    },
    changeRadio(value) {
        return { type: types.CHANGE_RADIO, payload: value }
    },
}

// ---- reducer ----- 

export function reducer(state = initialState, action) {
    const payload = action.payload;
    switch (action.type) {
        case types.CHANGE_RBICS:
            return { ...state, rbics: payload }
        case types.CHANGE_COUNTRY:
            return { ...state, country: payload }
        case types.CHANGE_RBICS_ONLY:
            return { ...state, rbics: payload }
        case types.CHANGE_COUNTRY_ONLY:
            return { ...state, country: payload }
        case types.CHANGE_RBICS_HIGHLIGHT:
            return { ...state, rbics: payload.rbics }
        case types.CHANGE_COUNTRY_HIGHLIGHT:
            return { ...state, country: payload.country }
        case types.UPDATE_LIST:
            return { ...state, countryList: payload.countryList, rbicsList: payload.rbicsList }
        case types.CHANGE_RADIO:
            return { ...state, filterType: payload }
        case types.CHANGE_RADIO_ONLY:
            return { ...state, filterType: payload }
        default:
            return state
    }
}




// ---- Component ----
export const Filter = ({ actions, rbics, country, rbicsList, countryList, fontFamily, filterType, hierarchy, tabState }) => {
    return (
        <div className="filter">
            {<style jsx global>{`
                .filter{
                    margin-left: auto;
                    display: flex;
                    min-width: 620px;
                }
                .country{
                    color: #fff;
                    font-size: 14px;
                }
                .select_box_country{
                    background-color: black;
                    border-radius: 0;
                    border: none;
                    border-bottom: 1px solid white !important;
                    color: white;
                    cursor: pointer;
                    margin-top: 8px;
                    padding: 0px;
                    padding-left: 4px;
                    width: 120px;
                    height: 34px;
                    outline: none;
                    font-size: 20px;
                    font-family: ${fontFamily} !important;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                }
                .select_box_country::-ms-expand{
                    display: none;
                }
                .select_box_country::-ms-value{
                    background: none;
                    color: white;
                }
                .filter-div{
                    color: #fff;
                    margin-left: auto;
                    font-size: 16px;
                    margin-top: 6px;
                    margin-right: 20px;
                }
                .rbics{
                    margin-left: 20px;
                    color: #fff;
                    font-size: 14px;
                }
                .select_box_rbics{
                    background-color: black;
                    border-radius: 0;
                    border-bottom: 1px solid white !important;
                    color: white;
                    cursor: pointer;
                    outline: none;
                    margin-top: 8px;
                    padding: 0px;
                    padding-left: 4px;
                    margin-right: 16px;
                    width: 240px;
                    border: none;
                    height: 34px;
                    font-size: 20px;
                    font-family: ${fontFamily} !important;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                }
                .select_box_rbics::-ms-expand{
                    display: none;
                }
                .select_box_rbics::-ms-value{
                    background: none;
                    color: white;
                }
                input[type="radio"] {
                    display: none;
                  }
                .checked-radio {
                    font-size: 14px;
                    display: block;
                    text-align: center;
                    cursor: pointer;
                    margin-left: 10px;
                    height: 20px;
                    line-height: 20px;
                    color: white;
                }
                .checked-radio svg{
                    position: relative;
                    top: 2px;
                    right: 2px;
                }
                .help-link{
                    color: white;
                    margin-right: 16px;
                    margin-top: 16px;
                }
                
            `}</style>}
            <div className="filter-div">
                <label className="checked-radio">
                    <input type="radio" name="rd" value="filter" checked={filterType === 'filter'}
                        onChange={() => {
                            actions.changeRadio("filter")
                        }} />
                    {filterType === 'filter' ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
                    フィルター
                </label>
                <label className="checked-radio">
                    <input type="radio" name="rd" value="highlight" checked={filterType === 'highlight'}
                        onChange={() => {
                            actions.changeRadio("highlight")
                        }} />
                    {filterType === 'highlight' ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
                    ハイライト

                </label>
            </div>
            <div className="country">
                <select className="select_box_country" value={country} onChange={(e) => actions.changeCountry(e.target.value, filterType, country, rbics, hierarchy, tabState)} >
                    <option value='国' selected disabled="disabled">国</option>
                    <option value='国' disabled={country == "国" ? "disabled" : ""} ></option>
                    <option value='米国' >米国</option>
                    <option value='日本' >日本</option>
                    <option value='ﾄﾞｲﾂ' >ﾄﾞｲﾂ</option>
                    <option value='英国' >英国</option>
                    <option value='ﾌﾗﾝｽ' >ﾌﾗﾝｽ</option>
                    <option value='ｲﾀﾘｱ' >ｲﾀﾘｱ</option>
                    <option value='ｶﾅﾀﾞ' >ｶﾅﾀﾞ</option>
                    <option disabled="disabled" >--------</option>
                    {countryList.map((value, i) => {
                        return <option value={value}>{value}</option>
                    })}
                </select>
            </div>

            <div className="rbics">
                <select className="select_box_rbics" value={rbics} onChange={(e) => actions.changeRBICS(e.target.value, filterType, country, rbics, hierarchy, tabState)}>
                    <option value='業種' selected disabled="disabled">業種</option>
                    <option value='業種' disabled={rbics == "業種" ? "disabled" : ""}></option>
                    {rbicsList.map((value, i) => {
                        return <option value={value}>{value}</option>
                    })}
                </select>
            </div>
            <a className="help-link"  target="_blank" href="static/help/supplyChainView_help.pdf"><FaRegQuestionCircle size={24}/></a>
        </div>
    )
}



const mapStateToProps = (state) => ({
    rbicsList: state.Filter.rbicsList,
    countryList: state.Filter.countryList,
    rbics: state.Filter.rbics,
    country: state.Filter.country,
    fontSize: state.Header.fontSize,
    fontFamily: state.Header.fontFamily,
    cnList: state.Table.cnList,
    filterType: state.Filter.filterType,
    hierarchy: state.Hierarchy.hierarchy,
    tabState: state.Tab.tabState
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
})

const view = connect(mapStateToProps, mapDispatchToProps)(Filter)
export { view }

