import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CoachProfile from "@/pages/CoachProfile";
import LessonDetail from "@/pages/LessonDetail";
import CoachList from "@/pages/CoachList";
import LessonList from "@/pages/LessonList";
import Booking from "@/pages/Booking";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import CoachSignup from "@/pages/CoachSignup";
import LessonRequest from "./pages/LessonRequest";
import Reviews from "./pages/Reviews";
import CoachFinder from "./pages/CoachFinder";
import Running from "./pages/Running";
import Layout from "@/components/layout/Layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/coaches" component={CoachList} />
      <Route path="/coach-finder" component={CoachFinder} />
      <Route path="/coaches/:id" component={CoachProfile} />
      <Route path="/lessons" component={LessonList} />
      <Route path="/lessons/:id" component={LessonDetail} />
      <Route path="/lesson-request" component={LessonRequest} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/booking/:lessonId" component={Booking} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/coach-signup" component={CoachSignup} />
      <Route path="/running" component={Running} />
      <Route path="/private-lesson" component={NotFound} />
      <Route path="/group-lesson" component={NotFound} />
      <Route path="/goalkeeper-lesson" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Router />
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
