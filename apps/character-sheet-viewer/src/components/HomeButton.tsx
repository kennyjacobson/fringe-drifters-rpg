import { useNavigate } from 'react-router-dom';

export function HomeButton() {
  const navigate = useNavigate();
  
  return (
    <button 
      onClick={() => navigate('/')}
      className="border border-green-700 bg-green-900/20 hover:bg-green-900/40 px-3 py-1 text-sm"
    >
      [HOME]
    </button>
  );
}
