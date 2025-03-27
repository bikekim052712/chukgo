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
import Layout from "@/components/layout/Layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/coaches" component={CoachList} />
      <Route path="/coaches/:id" component={CoachProfile} />
      <Route path="/lessons" component={LessonList} />
      <Route path="/lessons/:id" component={LessonDetail} />
      <Route path="/booking/:lessonId" component={Booking} />
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
