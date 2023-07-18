import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100vw',
    height: '100vh',
    alignItems: 'stretch',
    backgroundColor: theme.palette.background.paper,
  },
  margin: {
    margin: theme.spacing(1),
  },
  select: {
    padding: '4px 0px 0px 0px',
    minWidth: 80,
    fontSize: '0.875rem',
  },
  loading: {
    textAlign: 'center',
    paddingTop: '160px',
  },
  tabs: {
    width: '400px'
  },
  button: {
    width: '100%'
  },
  dialogTitle: {
    color: '#ffea00'
  },
  TextTitle: {
    opacity: 0.7
  },
  TextTitleSpan: {
    fontWeight: 'bold',
    paddingRight: '16px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
}));

export default useStyles;