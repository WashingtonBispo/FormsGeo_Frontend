import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/signUp"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
