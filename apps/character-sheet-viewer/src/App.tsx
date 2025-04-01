import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CharacterSheet } from './pages/CharacterSheet.js';
import { CharacterSheetAPI } from './pages/CharacterSheetAPI.js';
import { Home } from './pages/Home.js';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/character-sheet/:drifterId" element={<CharacterSheet  />} />
          <Route path="/character-sheet-api/:drifterId" element={<CharacterSheetAPI />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 