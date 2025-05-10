import { useEffect, useState } from 'react';
import NewsService from '@/services/newsService';
import AuthService from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Assuming you have this, or we can add it
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label'; // Assuming you have this
import { Switch } from '@/components/ui/switch'; // Assuming you have a Switch component
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react'; // Assuming you have Lucide React icons
import { AlertCircle, CheckCircle } from 'lucide-react';

// Define an interface for the NewsArticle structure
interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  source?: string;
  sourceUrl?: string;
  category: string;
  publishedDate?: string; // Or Date
}

// Define interface for scraper status
interface ScraperStatus {
  enabled: boolean;
  schedule: string;
  lastRunTime: string | null;
  lastRunArticleCount: number;
  health: string;
  usingFirecrawlApi: boolean;
}

export default function AdminPage() {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [source, setSource] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [category, setCategory] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Scraper states
  const [scraperStatus, setScraperStatus] = useState<ScraperStatus | null>(null);
  const [isScraping, setIsScraping] = useState(false);
  const [scraperMessage, setScraperMessage] = useState<string | null>(null);
  const [scraperError, setScraperError] = useState<string | null>(null);
  // Add new state for latest scraper
  const [isLatestScraping, setIsLatestScraping] = useState(false);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/signin'); // Redirect if not logged in
      return;
    }
    
    // Check if user has admin role
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'ROLE_ADMIN') {
      setError('Access denied. Admin privileges required.');
      navigate('/'); // Redirect to home page
      return;
    }
    
    fetchNews();
    fetchScraperStatus();
  }, [navigate]);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const response = await NewsService.getAllNewsAdmin();
      setNewsArticles(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch news articles.');
      console.error("Error fetching news:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/signin'); // Redirect on auth error
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchScraperStatus = async () => {
    try {
      const response = await NewsService.getScraperStatus();
      setScraperStatus(response.data);
    } catch (err: any) {
      console.error("Error fetching scraper status:", err);
      setScraperError("Failed to fetch scraper status");
    }
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || !currentUser.token) {
      setFormError("Authentication error. Please sign in again.");
      navigate('/signin');
      return;
    }

    if (!title || !summary || !category) {
      setFormError("Title, Summary, and Category are required.");
      return;
    }
    try {
      const newsData = { title, summary, source, sourceUrl, category };
      console.log("Submitting newsData:", newsData); // Log data before sending
      await NewsService.addNewsArticle(newsData);
      setFormSuccess("Article added successfully!");
      // Clear form
      setTitle('');
      setSummary('');
      setSource('');
      setSourceUrl('');
      setCategory('');
      // Refresh news list
      fetchNews();
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || 'Failed to add article.');
      console.error("Error adding article:", err);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || !currentUser.token) {
      setError("Authentication error. Please sign in again."); // Use main error state for this
      navigate('/signin');
      return;
    }

    try {
      await NewsService.deleteNewsArticle(id);
      // Refresh news list
      fetchNews();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete article.');
      console.error("Error deleting article:", err);
    }
  };

  const handleRunScraper = async () => {
    setIsScraping(true);
    setScraperMessage(null);
    setScraperError(null);
    
    try {
      const response = await NewsService.scrapeTechCrunch();
      setScraperMessage(response.data.message || "Scraping completed successfully");
      // Refresh news list and scraper status
      fetchNews();
      fetchScraperStatus();
    } catch (err: any) {
      setScraperError(err.response?.data?.message || err.message || 'Failed to run scraper.');
      console.error("Error running scraper:", err);
    } finally {
      setIsScraping(false);
    }
  };

  // Handler for latest articles scraper
  const handleRunLatestScraper = async () => {
    setIsLatestScraping(true);
    setScraperMessage(null);
    setScraperError(null);
    
    try {
      const response = await NewsService.scrapeLatestTechCrunch();
      setScraperMessage(response.data.message || "Latest articles scraping completed successfully");
      // Refresh news list and scraper status
      fetchNews();
      fetchScraperStatus();
    } catch (err: any) {
      setScraperError(err.response?.data?.message || err.message || 'Failed to run latest articles scraper.');
      console.error("Error running latest articles scraper:", err);
    } finally {
      setIsLatestScraping(false);
    }
  };

  const handleToggleScraper = async (enabled: boolean) => {
    try {
      await NewsService.toggleScraper(enabled);
      // Update local state immediately for better UX
      if (scraperStatus) {
        setScraperStatus({
          ...scraperStatus,
          enabled
        });
      }
      // Refresh full status after a short delay
      setTimeout(fetchScraperStatus, 1000);
    } catch (err: any) {
      setScraperError(err.response?.data?.message || err.message || 'Failed to toggle scraper.');
      console.error("Error toggling scraper:", err);
    }
  };

  const handleToggleFirecrawlApi = async (useFirecrawl: boolean) => {
    try {
      await NewsService.toggleFirecrawlApi(useFirecrawl);
      // Update local state immediately for better UX
      if (scraperStatus) {
        setScraperStatus({
          ...scraperStatus,
          usingFirecrawlApi: useFirecrawl
        });
      }
      // Refresh full status after a short delay
      setTimeout(fetchScraperStatus, 1000);
    } catch (err: any) {
      setScraperError(err.response?.data?.message || err.message || 'Failed to toggle scraping method.');
      console.error("Error toggling scraping method:", err);
    }
  };

  if (isLoading) {
    return <div className="text-center p-10 font-mono">Loading admin panel...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-mono font-black mb-8 text-center">Admin Dashboard</h1>

      {error && <p className="font-mono text-destructive text-sm text-center mb-4 p-2 bg-destructive/10 rounded">{error}</p>}

      <Tabs defaultValue="articles" className="mb-8">
        <TabsList className="w-full border-2 border-border p-1 bg-background shadow-[4px_4px_0px_0px_var(--foreground)] mb-4">
          <TabsTrigger value="articles" className="font-mono font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-1/2">
            Manage Articles
          </TabsTrigger>
          <TabsTrigger value="scraper" className="font-mono font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground w-1/2">
            TechCrunch Scraper
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
      <Card className="mb-8 border-4 border-border shadow-[8px_8px_0px_0px_var(--foreground)]">
        <CardHeader>
          <CardTitle className="font-mono font-black text-2xl">Add New Article</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddArticle} className="space-y-4">
            <div>
              <Label htmlFor="title" className="font-mono font-bold">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="font-mono border-2 border-border focus:border-primary shadow-[3px_3px_0px_0px_var(--foreground)]"/>
            </div>
            <div>
              <Label htmlFor="summary" className="font-mono font-bold">Summary</Label>
              <Textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} required className="font-mono border-2 border-border focus:border-primary shadow-[3px_3px_0px_0px_var(--foreground)] min-h-[100px]"/>
            </div>
            <div>
              <Label htmlFor="category" className="font-mono font-bold">Category</Label>
              <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="font-mono border-2 border-border focus:border-primary shadow-[3px_3px_0px_0px_var(--foreground)]"/>
            </div>
            <div>
              <Label htmlFor="source" className="font-mono font-bold">Source (Optional)</Label>
              <Input id="source" value={source} onChange={(e) => setSource(e.target.value)} className="font-mono border-2 border-border focus:border-primary shadow-[3px_3px_0px_0px_var(--foreground)]"/>
            </div>
            <div>
              <Label htmlFor="sourceUrl" className="font-mono font-bold">Source URL (Optional)</Label>
              <Input id="sourceUrl" type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} className="font-mono border-2 border-border focus:border-primary shadow-[3px_3px_0px_0px_var(--foreground)]"/>
            </div>
            {formError && <p className="font-mono text-destructive text-sm text-center">{formError}</p>}
            {formSuccess && <p className="font-mono text-green-600 dark:text-green-500 text-sm text-center">{formSuccess}</p>}
            <Button type="submit" className="w-full font-mono font-bold bg-primary text-primary-foreground border-2 border-primary transform hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_var(--foreground)]">Add Article</Button>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-mono font-black mb-6">Existing Articles</h2>
      {newsArticles.length === 0 && !isLoading && (
        <p className="text-center font-mono text-muted-foreground">No articles found.</p>
      )}
      <div className="space-y-4">
        {newsArticles.map(article => (
          <Card key={article.id} className="border-2 border-border shadow-[4px_4px_0px_0px_var(--foreground)]">
            <CardHeader>
              <CardTitle className="font-mono text-xl">{article.title}</CardTitle>
              <CardDescription className="font-mono text-sm">
                Category: {article.category} {article.source && `| Source: ${article.source}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-sm line-clamp-3">{article.summary}</p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="destructive" size="sm" onClick={() => handleDeleteArticle(article.id)} className="font-mono font-bold border-2 border-destructive transform hover:-translate-y-1 transition-transform">Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
        </TabsContent>

        <TabsContent value="scraper">
          <Card className="mb-8 border-4 border-border shadow-[8px_8px_0px_0px_var(--foreground)]">
            <CardHeader>
              <CardTitle className="font-mono font-black text-2xl">TechCrunch Scraper</CardTitle>
              <CardDescription className="font-mono">
                Automatically scrape the latest tech news from TechCrunch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-mono font-bold">Scraper Status</h3>
                  <p className="text-sm font-mono text-muted-foreground">Automatic scraping every 3 hours</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="scraper-enabled"
                    checked={scraperStatus?.enabled || false}
                    onCheckedChange={handleToggleScraper}
                  />
                  <Label htmlFor="scraper-enabled" className="font-mono">
                    {scraperStatus?.enabled ? 'Enabled' : 'Disabled'}
                  </Label>
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <h3 className="font-mono font-bold">Scraping Method</h3>
                  <p className="text-sm font-mono text-muted-foreground">
                    {scraperStatus?.usingFirecrawlApi ? 'Using Firecrawl API' : 'Using JSoup'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="firecrawl-api"
                    checked={scraperStatus?.usingFirecrawlApi || false}
                    onCheckedChange={handleToggleFirecrawlApi}
                  />
                  <Label htmlFor="firecrawl-api" className="font-mono">
                    {scraperStatus?.usingFirecrawlApi ? 'Firecrawl API' : 'JSoup'}
                  </Label>
                </div>
              </div>

              <div className="bg-card text-card-foreground shadow-sm rounded-md p-4 border-2 border-border">
                <h3 className="font-mono font-bold mb-2">Scraper Health</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-mono text-sm">Status:</span>
                    <span className={`font-mono text-sm ${scraperStatus?.health?.startsWith('OK') ? 'text-green-600 dark:text-green-500' : 'text-destructive'}`}>
                      {scraperStatus?.health || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-sm">Last Run:</span>
                    <span className="font-mono text-sm">{scraperStatus?.lastRunTime ? new Date(scraperStatus.lastRunTime).toLocaleString() : 'Never'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-sm">Articles Last Run:</span>
                    <span className="font-mono text-sm">{scraperStatus?.lastRunArticleCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-sm">Schedule:</span>
                    <span className="font-mono text-sm">{scraperStatus?.schedule || 'Every 3 hours'}</span>
                  </div>
                </div>
              </div>

              {scraperMessage && (
                <div className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 p-3 rounded flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <p className="font-mono text-sm">{scraperMessage}</p>
                </div>
              )}

              {scraperError && (
                <div className="bg-destructive/10 text-destructive p-3 rounded flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p className="font-mono text-sm">{scraperError}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleRunScraper} 
                disabled={isScraping || isLatestScraping} 
                className="w-full font-mono font-bold bg-primary text-primary-foreground border-2 border-primary transform hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_var(--foreground)] mr-2"
              >
                {isScraping ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scraping TechCrunch...
                  </>
                ) : (
                  'Run Full Scraper'
                )}
              </Button>
              
              <Button 
                onClick={handleRunLatestScraper} 
                disabled={isScraping || isLatestScraping} 
                className="w-full font-mono font-bold bg-green-600 text-white border-2 border-green-600 transform hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_var(--foreground)] ml-2"
              >
                {isLatestScraping ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scraping Latest Articles...
                  </>
                ) : (
                  'Scrape Latest Articles'
                )}
              </Button>
            </CardFooter>
          </Card>

          <div className="text-center font-mono text-sm text-muted-foreground">
            <p>The scraper runs automatically every 3 hours to fetch the latest tech news.</p>
            <p className="mt-1">You can also manually trigger the scraper using the button above.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 