import { Component, useState, useEffect, useRef } from 'react';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// ----- initial state --- 
export const initialState = {
    historyData: ""
};

// ---- type ----- 

export const types = {
    CSV_DOWNLOAD: "CSV_DOWNLOAD"
};



// ---- action ----- 

export const actions = {
    Output(){
        return { type: types.CSV_DOWNLOAD}
    }
}



// ---- reducer ----- 

export function reducer(state = initialState, action) {
    const payload = action.payload;
    switch (action.type) {
        default:
            return state
    }
}




//---- Component ----
const OutputButton = ({tabState,fontFamily  , actions}) => {
      return (
        <div>
            { tabState == "3" 
            ? 
            <button className="csv-download" onClick={actions.Output}>CSV ダウンロード</button> 
            : ""}
            {<style jsx global>{`
                .csv-download{
                    cursor: pointer;
                    height: 30px;
                    min-width: 100px;
                    outline: 0;
                    text-decoration: none;
                    background: black;
                    border: none;
                    position: fixed;
                    bottom: 52px;
                    color: white;
                    right: 52px;
                    font-size: 12px;
                    box-shadow: 1px 1px 1px #BBBBBB;
                    font-family: ${fontFamily} !important;
                }    
                .csv-download:hover{
                        background: #333;
                    }
                .csv-download:active{
                        background: #555;
                }
                
            `}</style>}
            
        </div>
      )
    }




const mapStateToProps = (state) => ({
    comData: state.Force.comData,
    tabState: state.Tab.tabState,
    history: state.Force.history,
    fontSize: state.Header.fontSize,
    fontFamily: state.Header.fontFamily,
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
    
})

const view = connect(mapStateToProps, mapDispatchToProps)(OutputButton)
export { view }



