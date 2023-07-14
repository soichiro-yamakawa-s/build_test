import { StyledEngineProvider } from '@mui/material/styles';
import Tabs from './tabs';
import './App.css';
import Header from './header/index';

function App() {
  return (
    <div className="App">
      <StyledEngineProvider>
        <Header></Header>
        <Tabs></Tabs>
      </StyledEngineProvider>
    </div>
  );
}

export default App;
