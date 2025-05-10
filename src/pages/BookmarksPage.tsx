import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookmarkService from '@/services/bookmarkService';
import AuthService from '@/services/authService';
import { NewsItem } from '@/components/news-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  category: string;
  time: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/signin'); // Redirect if not logged in
      return;
    }
    
    fetchBookmarks();
  }, [navigate]);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const response = await BookmarkService.getUserBookmarks();
      setBookmarks(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch bookmarks.');
      console.error("Error fetching bookmarks:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/signin'); // Redirect on auth error
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-10 font-mono">Loading bookmarks...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-mono font-black mb-8 text-center">Your Bookmarked Articles</h1>

      {error && <p className="font-mono text-destructive text-sm text-center mb-4 p-2 bg-destructive/10 rounded">{error}</p>}

      <Card className="border-4 border-border shadow-[8px_8px_0px_0px_var(--foreground)]">
        <CardHeader>
          <CardTitle className="font-mono font-black text-2xl">Saved Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {bookmarks.length === 0 ? (
              <p className="text-center font-mono py-8">You haven't bookmarked any articles yet.</p>
            ) : (
              bookmarks.map((article) => (
                <div key={article.id} className="relative">
                  <NewsItem item={article} />
                  <button
                    onClick={async () => {
                      try {
                        await BookmarkService.removeBookmark(article.id);
                        fetchBookmarks(); // Refresh the list
                      } catch (err) {
                        console.error("Error removing bookmark:", err);
                      }
                    }}
                    className="absolute top-2 right-2 z-10 bg-destructive text-destructive-foreground font-mono text-xs px-2 py-1 rounded shadow hover:bg-destructive/80"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 