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
import { AdminRoute } from "@/lib/admin-route";
import AboutUs from "@/pages/AboutUs";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CompanyInfoEdit from "@/pages/admin/CompanyInfoEdit";
import AuthPage from "@/pages/auth-page";
import AdminLogin from "@/pages/AdminLogin";
import CompanyInfoPage from "@/pages/CompanyInfoPage";
import CompanyInfoListPage from "@/pages/CompanyInfo";
import ProfileComplete from "@/pages/ProfileComplete";

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
      <ProtectedRoute path="/profile/complete" component={ProfileComplete} />
      <Route path="/coach-signup" component={CoachSignup} />
      
      {/* 인증 페이지 */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/admin-login" component={AdminLogin} />
      
      <Route path="/running" component={Running} />
      <Route path="/insurance-analysis/write" component={InsuranceAnalysis} />
      <Route path="/insurance-analysis/:id" component={InsuranceAnalysis} />
      <Route path="/insurance-analysis" component={InsuranceAnalysis} />
      <Route path="/private-lesson" component={NotFound} />
      <Route path="/group-lesson" component={NotFound} />
      <Route path="/goalkeeper-lesson" component={NotFound} />
      
      {/* 회사 정보 */}
      <Route path="/about-us" component={AboutUs} />
      <Route path="/company-info" component={CompanyInfoListPage} />
      <Route path="/company-info/:id" component={CompanyInfoPage} />
      
      {/* 관리자 페이지 */}
      <AdminRoute path="/admin/company-info/new" component={CompanyInfoEdit} />
      <AdminRoute path="/admin/company-info/:id" component={CompanyInfoEdit} />
      <AdminRoute path="/admin" component={AdminDashboard} />
      
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