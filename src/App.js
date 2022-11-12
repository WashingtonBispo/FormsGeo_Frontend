import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/signUp"
import SignIn from "./pages/signIn"
import Forms from "./pages/forms"
import Users from "./pages/users"
import Profile from "./pages/profile"
import Questions from "./pages/questions"
import GlobalStyle from "./utils/globalStyle"

import { ProtectedRoute } from "./ProtectedRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/cadastro" exact element={<SignUp />} />
        <Route path="/login" exact element={<SignIn />} />
        <Route exact path='/' element={<ProtectedRoute authLevel={"Researcher"} />}>
            <Route exact path='/' element={<Forms />}/>
        </Route>
        <Route exact path='/perfil' element={<ProtectedRoute authLevel={"Researcher"} />}>
            <Route exact path='/perfil' element={<Profile />}/>
        </Route>
        <Route exact path='/questoes' element={<ProtectedRoute authLevel={"Researcher"} />}>
            <Route exact path='/questoes' element={<Questions />}/>
        </Route>
        <Route exact path='/usuarios' element={<ProtectedRoute authLevel={"Admin"} />}>
            <Route exact path='/usuarios' element={<Users />}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
