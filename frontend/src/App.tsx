import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { lazy, Suspense } from "react";
import { HomeSkeleton } from "./components/skeletons/HomeSkeleton";
import { AboutSkeleton } from "./components/skeletons/AboutSkeleton";
import { CrewSkeleton } from "./components/skeletons/CrewSkeleton";
import { RidesSkeleton } from "./components/skeletons/RidesSkeleton";
import { JoinSkeleton } from "./components/skeletons/JoinSkeleton";
import { EventsSkeleton } from "./components/skeletons/EventsSkeleton";
import { ContactSkeleton } from "./components/skeletons/ContactSkeleton";
import { SignInSkeleton } from "./components/skeletons/SignInSkeleton";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Crew = lazy(() => import("./pages/Crew"));
const Rides = lazy(() => import("./pages/Rides"));
const Join = lazy(() => import("./pages/Join"));
const Events = lazy(() => import("./pages/Events"));
const Contact = lazy(() => import("./pages/Contact"));
const SignIn = lazy(() => import("./pages/SignIn"));

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<HomeSkeleton />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/about"
            element={
              <Suspense fallback={<AboutSkeleton />}>
                <About />
              </Suspense>
            }
          />
          <Route
            path="/crew"
            element={
              <Suspense fallback={<CrewSkeleton />}>
                <Crew />
              </Suspense>
            }
          />
          <Route
            path="/rides"
            element={
              <Suspense fallback={<RidesSkeleton />}>
                <Rides />
              </Suspense>
            }
          />
          <Route
            path="/events"
            element={
              <Suspense fallback={<EventsSkeleton />}>
                <Events />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense fallback={<ContactSkeleton />}>
                <Contact />
              </Suspense>
            }
          />
          <Route
            path="/join"
            element={
              <Suspense fallback={<JoinSkeleton />}>
                <Join />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="/signin"
          element={
            <Suspense fallback={<SignInSkeleton />}>
              <SignIn />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
