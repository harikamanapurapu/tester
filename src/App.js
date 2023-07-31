import ProductList from "./Components/ProductList/ProductList";
import Login from "./Components/Login/Login"
import Signup from "./Components/Signup/Signup"
import { BrowserRouter, Routes, Route } from 'react-router-dom'


function App() {
  

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductList />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/Signup" element={<Signup/>}></Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
