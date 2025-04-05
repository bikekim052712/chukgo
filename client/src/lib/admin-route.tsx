import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function AdminRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  // 관리자가 아니면 로그인 페이지로 리다이렉트
  if (!user || !user.isAdmin) {
    return (
      <Route path={path}>
        <Redirect to="/admin-login" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}