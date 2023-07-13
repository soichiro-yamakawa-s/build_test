import Modal from 'react-modal';
import { connect } from 'react-redux';

// ----- initial state --- 

export const initialState =  {
    isOpen: false,
    message: ""
};


// ---- type ----- 

export const types = {
    USER_FETCH_FAILED: 'USER_FETCH_FAILED',
    CLOSE_DIALOG: 'CLOSE_DIALOG'
};


// ---- reducer ----- 

export function reducer(state = initialState, action) {
    const payload = action.payload;
    
    switch (action.type) {
        case types.USER_FETCH_FAILED:
            return { ...state, message: payload.message, isOpen: payload.isOpen }
        case types.CLOSE_DIALOG:
            return { ...state, isOpen: payload }
        default:
            return state
    }
}

const customStyles = {
    content : {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: "240px",
      height: "80px",
      background:"#f5f7f7"
    }
  };

const App = ({isOpen, close, message}) => {

  return (
    <div> 
      <Modal
          isOpen={isOpen}
          ariaHideApp={false}
          style={customStyles}>
        <style jsx>{`
        div{
            font-size: 14px;
        }
        button {
                display: block;
                margin: auto;
                margin-left: 80px;
                margin-top: 40px;
                width: 80px;
                height: 24px;
                text-decoration: none;
                color: #FFFFFF;
                background: #003B75;
                border: none;
                font-size: 12px;
                cursor: pointer;
                font-family: MeiryoKe_Gothic, "Ricty Diminished", "Osaka－等幅", "Osaka-等幅", Osaka-mono, "ＭＳ ゴシック", "MS Gothic", SFMono-Regular, "Courier New", Courier, Monaco, Menlo, Consolas, "Lucida Console", monospace, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
            }
        `}</style>
        <div className="error_message">{message}</div>
        <button className="error_close_button" onClick={()=>close()}>閉じる</button>
      </Modal>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    message: state.ShowMessage.message,
    isOpen: state.ShowMessage.isOpen,
   }
}
   
const mapDispatchToProps = (dispatch) => ({
    close: () => dispatch({ type: types.CLOSE_DIALOG, payload: false}),
})

const view = connect(mapStateToProps,  mapDispatchToProps)(App)
export { view }