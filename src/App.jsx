import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./Layout.jsx"
import './App.css'
import Home from "./components/Home.jsx"
import Features from "./components/Features.jsx"

function App() {
  

  return (
    <>
<BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* <Route path="/" element={<Features />} /> */}
          {/* <Route path="pricing" element={<Pricing />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
