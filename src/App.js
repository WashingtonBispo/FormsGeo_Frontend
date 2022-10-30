import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/signUp"
import SignIn from "./pages/signIn"
import Forms from "./pages/forms"

import { ProtectedRoute } from "./ProtectedRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/cadastro" exact element={<SignUp />} />
        <Route path="/login" exact element={<SignIn />} />
        <Route exact path='/forms' element={<ProtectedRoute authLevel={"Researcher"} />}>
            <Route exact path='/forms' element={<Forms />}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
