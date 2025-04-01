import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CharacterSheet } from './pages/CharacterSheet.js';
import { CharacterSheetAPI } from './pages/CharacterSheetAPI.js';
import { CharacterSheetCompact } from './pages/CharacterSheetCompact.js';
import { CharacterSheetCompactAlt } from './pages/CharacterSheetCompactAlt.js';
import { Home } from './pages/Home.js';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/character-sheet/:drifterId" element={<CharacterSheet  />} />
          <Route path="/character-sheet-api/:drifterId" element={<CharacterSheetAPI />} />
          <Route path="/character-sheet-compact/:drifterId" element={<CharacterSheetCompact />} />
          <Route path="/character-sheet-compact-alt/:drifterId" element={<CharacterSheetCompactAlt />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 