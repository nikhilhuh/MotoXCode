import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Crew from "./pages/Crew";
import Rides from "./pages/Rides";
import Join from "./pages/Join";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import { useEffect } from "react";
import { socketListeners } from "./socket/socketListeners";
import socket from "./socket/socketSetup";

export default function App() {
  useEffect(() => {
    socketListeners(socket);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/crew" element={<Crew />} />
          <Route path="/rides" element={<Rides />} />
          <Route path="/join" element={<Join />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
