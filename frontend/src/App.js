import Header from "./components/Header";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Bet from "./pages/Bet";
import Nfts from "./pages/Nfts";
import Raffle from "./pages/Raffle";


function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Bet />} />
          <Route path="nfts" element={<Nfts />} />
          <Route path="raffle" element={<Raffle />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
