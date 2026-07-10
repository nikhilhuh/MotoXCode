import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { ProfileSkeleton } from "./components/skeletons/ProfileSkeleton";
import { LegalSkeleton } from "./components/skeletons/LegalSkeleton";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Crew = lazy(() => import("./pages/Crew"));
const Rides = lazy(() => import("./pages/Rides"));
const Join = lazy(() => import("./pages/Join"));
const Events = lazy(() => import("./pages/Events"));
const Contact = lazy(() => import("./pages/Contact"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));

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

          <Route
            path="/profile/:username"
            element={
              <Suspense fallback={<ProfileSkeleton />}>
                <Profile />
              </Suspense>
            }
          />
          <Route
            path="/legal/privacy"
            element={
              <Suspense fallback={<LegalSkeleton />}>
                <PrivacyPolicy />
              </Suspense>
            }
          />
          <Route
            path="/legal/terms"
            element={
              <Suspense fallback={<LegalSkeleton />}>
                <TermsOfService />
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
        <Route
          path="/signup"
          element={
            <Suspense fallback={<SignInSkeleton />}>
              <SignUp />
            </Suspense>
          }
        />
        <Route
          path="/reset-password"
          element={
            <Suspense fallback={<SignInSkeleton />}>
              <ResetPassword />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
