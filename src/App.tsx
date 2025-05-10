import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { NewsItem } from "@/components/news-item"
import { fetchNews } from "@/lib/news"
import { Link, Routes, Route, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import SignInPage from "@/pages/SignInPage"
import SignUpPage from "@/pages/SignUpPage"
import AdminPage from "@/pages/AdminPage"
import BookmarksPage from "@/pages/BookmarksPage"
import AuthService from "@/services/authService"

interface NewsItemData {
  title: string
  summary: string
  source: string
  sourceUrl: string
  category: string
  time: string
}

const HomePage = () => {
  const [news, setNews] = useState<NewsItemData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true)
        console.log("Fetching news data...")
      const newsData = await fetchNews()
      setNews(newsData)
        console.log("News data loaded successfully")
      } catch (error) {
        console.error("Error loading news:", error)
      } finally {
        setLoading(false)
      }
    }
    
    loadNews()
  }, [])

  return (
    <>
      <div className="flex flex-col items-center justify-center mb-10 text-center w-full max-w-4xl">
        <h1 className="text-4xl md:text-4xl font-mono font-black tracking-tight transform -rotate-1 mb-4">
          Today in <span className="text-primary">Tech</span>
        </h1>
        <p className="mt-2 font-mono max-w-[600px] border-2 border-border p-3 bg-card text-card-foreground shadow-[5px_5px_0px_0px_var(--foreground)]">
          A simple, raw summary of what happened in tech today. No ads, no clickbait.
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center items-center mb-6">
            <div className="flex justify-between items-center w-full">
              <TabsList className="border-2 border-border p-1 bg-background shadow-[4px_4px_0px_0px_var(--foreground)]">
                <TabsTrigger
                  value="all"
                  className="font-mono font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  ALL
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="font-mono font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  AI
                </TabsTrigger>
                <TabsTrigger
                  value="dev"
                  className="font-mono font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  DEV
                </TabsTrigger>
                <TabsTrigger
                  value="business"
                  className="font-mono font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  BUSINESS
                </TabsTrigger>
              </TabsList>
              <div className="text-sm font-mono border-2 border-border px-2 py-1 bg-card text-card-foreground">
                Updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <Card className="border-4 border-border shadow-[8px_8px_0px_0px_var(--foreground)] bg-card text-card-foreground">
              <CardContent className="p-6">
                <div className="space-y-8">
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="font-mono font-bold">Loading news data...</p>
                    </div>
                  ) : news.length > 0 ? (
                    news.map((item, index) => (
                    <NewsItem key={index} item={item} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="font-mono font-bold">No news items available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="mt-0">
            <Card className="border-4 border-border shadow-[8px_8px_0px_0px_var(--foreground)] bg-card text-card-foreground">
              <CardContent className="p-6">
                <div className="space-y-8">
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="font-mono font-bold">Loading news data...</p>
                    </div>
                  ) : news.filter((item) => item.category === "ai").length > 0 ? (
                    news
                    .filter((item) => item.category === "ai")
                    .map((item, index) => (
                      <NewsItem key={index} item={item} />
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="font-mono font-bold">No AI news available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dev" className="mt-0">
            <Card className="border-4 border-border shadow-[8px_8px_0px_0px_var(--foreground)] bg-card text-card-foreground">
              <CardContent className="p-6">
                <div className="space-y-8">
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="font-mono font-bold">Loading news data...</p>
                    </div>
                  ) : news.filter((item) => item.category === "dev").length > 0 ? (
                    news
                    .filter((item) => item.category === "dev")
                    .map((item, index) => (
                      <NewsItem key={index} item={item} />
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="font-mono font-bold">No dev news available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="mt-0">
            <Card className="border-4 border-border shadow-[8px_8px_0px_0px_var(--foreground)] bg-card text-card-foreground">
              <CardContent className="p-6">
                <div className="space-y-8">
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="font-mono font-bold">Loading news data...</p>
                    </div>
                  ) : news.filter((item) => item.category === "business").length > 0 ? (
                    news
                    .filter((item) => item.category === "business")
                    .map((item, index) => (
                      <NewsItem key={index} item={item} />
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="font-mono font-bold">No business news available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default function App() {
  const today = new Date()
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser())
  const navigate = useNavigate()

  const handleLogout = () => {
    AuthService.logout()
    setCurrentUser(null)
    navigate("/")
  }

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(AuthService.getCurrentUser());
    };

    window.addEventListener('storage', handleStorageChange);
    
    setCurrentUser(AuthService.getCurrentUser());

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground items-center">
      <header className="sticky top-0 z-50 w-full border-b-4 border-border bg-background">
        <div className="mx-auto flex h-20 items-center justify-center px-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="font-mono font-black text-3xl transform -rotate-1 hover:rotate-1 transition-transform"
              >
                nios<span className="text-primary">.live</span>
              </Link>
              <div className="hidden md:flex items-center text-sm font-mono border-2 border-border px-2 py-1 bg-background">
                <CalendarIcon className="mr-1 h-4 w-4" />
                {formatDate(today)}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex">
                <ThemeToggle />
              </div>
              <div className="flex items-center gap-2">
                {currentUser ? (
                  <>
                    <span className="font-mono font-bold text-sm hidden md:block">
                      Hi, {currentUser.username}
                    </span>
                    {AuthService.isAdmin() && (
                      <Link to="/admin">
                        <Button
                          variant="outline"
                          size="sm"
                          className="font-mono font-bold border-2 border-border hover:bg-primary hover:text-primary-foreground transform hover:-translate-y-1 transition-transform"
                        >
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Link to="/bookmarks">
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-mono font-bold border-2 border-border hover:bg-primary hover:text-primary-foreground transform hover:-translate-y-1 transition-transform"
                      >
                        Bookmarks
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="font-mono font-bold border-2 border-border hover:bg-destructive hover:text-destructive-foreground transform hover:-translate-y-1 transition-transform"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/signin">
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-mono font-bold border-2 border-border hover:bg-primary hover:text-primary-foreground transform hover:-translate-y-1 transition-transform"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button
                        size="sm"
                        className="font-mono font-bold bg-primary text-primary-foreground border-2 border-primary transform hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_var(--foreground)]"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full py-8 md:py-12 flex flex-col items-center px-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
        </Routes>
      </main>
      <footer className="border-t-4 border-border py-6 md:py-0 bg-background w-full">
        <div className="w-full mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:h-20 px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm font-mono font-bold">© {new Date().getFullYear()} nios.live. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/about" className="text-sm font-mono font-bold hover:underline hover:text-primary">
                About
              </Link>
              <Link to="/privacy" className="text-sm font-mono font-bold hover:underline hover:text-primary">
                Privacy
              </Link>
              <Link to="/terms" className="text-sm font-mono font-bold hover:underline hover:text-primary">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
