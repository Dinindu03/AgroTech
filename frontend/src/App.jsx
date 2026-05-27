import {
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home.jsx";

function App() {
  return (
    <HashRouter>
      <Routes>

        {/* Default Route */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Home Route */}
        <Route
          path="/home"
          element={<Home />}
        />

      </Routes>
    </HashRouter>
  );
}

export default App;