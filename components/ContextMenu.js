import { ContextMenu, ContextMenuTrigger, MenuItem } from "react-contextmenu";
import { connect } from 'react-redux'

import _propType from 'prop-types';

export const types = {
  DOWNLOAD: 'DOWNLOAD',
  COPY_SELECTED_ROWS: 'COPY_SELECTED_ROWS',
  SELECT_ALL: 'SELECT_ALL'
};

const App = (props) => {  
  const copyMenu = (
    <div id="context_copy"><span>コピー</span></div>
  );
  
  const selectAllMenu = (
    <div id="context_select_all"><span>すべて選択</span></div>
  );
  
  const downloadMenu = (
    <div id="context_download"><span>Download</span></div>
  );
  
  return (
    <div>
    <style jsx global>{`
        .react-contextmenu {
            position: "fixed"
            background-clip: padding-box;
            background: #FAFAFA;
            color: #37474F;
            box-shadow: 1px 1px 1px;
            margin: 2px 0 0;
            width: 120px;
            outline: none;
            opacity: 0;
            padding: 5px 0;
            pointer-events: none;
            text-align: left;
            transition: opacity 250ms ease !important;
        }
        .react-contextmenu.react-contextmenu--visible {
            opacity: 1;
            pointer-events: auto;
            z-index: 9999;
        }
        .react-contextmenu-item {
            border: 0;
            cursor: pointer;
            font-size: 12px;
            font-weight: 400;
            line-height: 1.5;
            padding: 3px 20px;
            text-align: inherit;
            white-space: nowrap;
            
        }
        .react-contextmenu-item:hover{
            background: #EEEEEE;
        }
        .react-contextmenu-item--disabled {
          cursor: default;
          color: #BDBDBD;
        }
        .react-contextmenu-item--disabled:hover{
          background: none;
        }
    `}</style>
      <ContextMenuTrigger id="right-click-menu-id" holdToDisplay={-1}>
        {props.children}
      </ContextMenuTrigger>

      <ContextMenu id="right-click-menu-id" >
        <div>
          <MenuItem onClick={props.copy} disabled={props.loading}>
              {copyMenu}
          </MenuItem>
          <MenuItem onClick={props.selectAll} disabled={props.loading}>
              {selectAllMenu}
          </MenuItem>
          <MenuItem onClick={props.download} disabled={props.loading}>
              {downloadMenu}
          </MenuItem>
        </div>
      </ContextMenu>
    </div>
  );
}

App.propTypes = {
  children: _propType.node
 };

const mapStateToProps = (state, ownProps) => ({
  loading: state.header.loading
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  download: () => dispatch({ type: types.DOWNLOAD }),
  copy: () => dispatch({type: types.COPY_SELECTED_ROWS}),
  selectAll: () => dispatch({type: types.SELECT_ALL})
})

const view = connect(mapStateToProps, mapDispatchToProps)(App)
export { view }