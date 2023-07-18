import { Box } from '@material-ui/core/';
import Analyst from '../components/AnalystPage'
import Public from '../components/PublicInfoPage'

export default function TabSwitches(props) {
  const type = props.type;
  const tabsInfo = props.tabsInfo;
  switch (type) {
    case 1:
      return tabsInfo[1] === true ? <Analyst /> : <Box p={3} style={{textAlign: 'center'}}>No Content</Box>
    case 2:
      return tabsInfo[2] === true ? <Public /> : <Box p={3} style={{textAlign: 'center'}}>No Content</Box>
    default:
      return <Box p={3} style={{textAlign: 'center'}}>No Content</Box>
  }
}