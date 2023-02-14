import { useState } from 'react';
import './App.css';
import Home from './Components/Home';

function App() {

  const [dark, setDark] = useState<any>(null);
  
  return (
    <div className={`App ${dark ? "dark" : "light"}`}>
      <Home setDark={setDark} dark={dark} />
    </div>
  );
}

export default App;
