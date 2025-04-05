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
import LessonTypes from "@/pages/LessonTypes";
import Booking from "@/pages/Booking";
import CoachSignup from "@/pages/CoachSignup";
import LessonRequest from "./pages/LessonRequest";
import Reviews from "./pages/Reviews";
import ReviewWrite from "./pages/ReviewWrite";
import CoachFinder from "./pages/CoachFinder";
import Running from "./pages/Running";
import InsuranceAnalysis from "@/pages/InsuranceAnalysis";
import ChatPage from "@/pages/ChatPage";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Layout from "@/components/layout/Layout";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/coaches/search" component={CoachFinder} />
      <Route path="/coaches" component={CoachList} />
      <Route path="/coaches/:id" component={CoachProfile} />
      <Route path="/lessons" component={LessonList} />
      <Route path="/lessons/:id" component={LessonDetail} />
      <Route path="/lesson-types" component={LessonTypes} />
      
      {/* 인증이 필요한 경로 */}
      <Route path="/lesson-request" component={LessonRequest} />
      <Route path="/reviews" component={Reviews} />
      <ProtectedRoute path="/reviews/write/:id" component={ReviewWrite} />
      <ProtectedRoute path="/reviews/write" component={ReviewWrite} />
      <ProtectedRoute path="/booking/:lessonId" component={Booking} />
      <Route path="/coach-signup" component={CoachSignup} />
      
      {/* 인증 페이지 */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      <Route path="/running" component={Running} />
      <Route path="/insurance-analysis/write" component={InsuranceAnalysis} />
      <Route path="/insurance-analysis/:id" component={InsuranceAnalysis} />
      <Route path="/insurance-analysis" component={InsuranceAnalysis} />
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
      <AuthProvider>
        <Layout>
          <Router />
        </Layout>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;