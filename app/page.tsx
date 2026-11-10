import { Suspense } from "react";
import { cookies } from "next/headers";
import { Compass } from "lucide-react";
import { getCurrentUser, getUserProfile, getCategories, getWebsites } from "@/lib/data";
import { HomeHeader } from "@/components/home/home-header";
import { HomeView } from "@/components/home/home-view";
import { HomeViewSkeleton } from "@/components/skeletons/user-skeletons";

async function HomeContent() {
  const cookieStore = await cookies();
  const hasVisitedCookie = cookieStore.has("system_intro_visited");
  const initialShowIntro = !hasVisitedCookie;

  const user = await getCurrentUser();
  const profile = user ? await getUserProfile() : null;

  const [categories, websites] = await Promise.all([
    getCategories(),
    getWebsites(),
  ]);

  return (
    <>
      <HomeHeader
        profile={profile}
        categories={categories}
        initialShowIntro={initialShowIntro}
      />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <HomeView
          initialWebsites={websites}
          categories={categories}
          currentUserId={profile?.id}
          isAdmin={profile?.role === "admin"}
        />
      </main>
    </>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Suspense
        fallback={
          <div className="flex-1 flex flex-col">
            <div className="h-16 border-b bg-card/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between" />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <HomeViewSkeleton />
            </main>
          </div>
        }
      >
        <HomeContent />
      </Suspense>

      <footer className="border-t bg-card/50 py-6 text-center text-xs text-muted-foreground mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Compass className="h-4 w-4 text-primary" />
            <span>Hệ thống quản lý đa chức năng</span>
          </div>
          <p>© 2026 Hệ thống quản lý đa chức năng. Nền tảng quản lý liên kết tập trung.</p>
        </div>
      </footer>
    </div>
  );
}
