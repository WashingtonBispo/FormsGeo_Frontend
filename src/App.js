import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/signUp"
import SignIn from "./pages/signIn"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/cadastro" element={<SignUp />} />
        <Route path="/" element={<SignIn />} />
      </Routes>
    </div>
  );
}

export default App;
