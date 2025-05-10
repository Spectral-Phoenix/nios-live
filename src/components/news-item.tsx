import { Link } from "react-router-dom"
import { ExternalLinkIcon, BookmarkIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn, formatRelativeTime } from "@/lib/utils"
import { useState, useEffect } from "react"
import BookmarkService from "@/services/bookmarkService"
import AuthService from "@/services/authService"

interface NewsItemProps {
  item: {
    id?: number; // Add optional id for bookmark functionality
    title: string
    summary: string
    source: string
    sourceUrl: string
    category: string
    time: string
  }
}

export function NewsItem({ item }: NewsItemProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Category coloring
  const categoryColors = {
    ai: "bg-[#ff3e00] text-white border-black dark:border-white",
    dev: "bg-[#0070f3] text-white border-black dark:border-white",
    business: "bg-[#00cc88] text-black border-black dark:border-white",
    default: "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white",
  }

  const categoryColor = categoryColors[item.category as keyof typeof categoryColors] || categoryColors.default

  // Check bookmark status and login status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = AuthService.getCurrentUser();
      setIsLoggedIn(!!currentUser);
    };

    const checkBookmarkStatus = async () => {
      if (!item.id || !isLoggedIn) return;
      
      try {
        setIsLoading(true);
        const response = await BookmarkService.checkBookmark(item.id);
        setIsBookmarked(response.data);
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    checkBookmarkStatus();
  }, [item.id, isLoggedIn]);

  const toggleBookmark = async () => {
    if (!item.id || !isLoggedIn) return;
    
    try {
      setIsLoading(true);
      if (isBookmarked) {
        await BookmarkService.removeBookmark(item.id);
      } else {
        await BookmarkService.addBookmark(item.id);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3 p-4 border-2 border-black dark:border-white transform hover:-rotate-1 transition-transform">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Badge className={cn("rounded-none font-mono font-bold text-sm px-3 py-1 border-2", categoryColor)}>
            {item.category.toUpperCase()}
          </Badge>
          <span className="text-xs font-mono font-bold bg-[#f0f0f0] dark:bg-[#333] px-2 py-1 border border-black dark:border-white">
            {formatRelativeTime(item.time)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isLoggedIn && item.id && (
            <button
              onClick={toggleBookmark}
              disabled={isLoading}
              className={cn(
                "p-1 rounded-full",
                isBookmarked ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
              title={isBookmarked ? "Remove bookmark" : "Bookmark this article"}
            >
              <BookmarkIcon className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} />
            </button>
          )}
          <Link
            to={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono font-bold hover:text-[#ff3e00] flex items-center gap-1 border-b-2 border-black dark:border-white"
          >
            {item.source}
            <ExternalLinkIcon className="h-3 w-3" />
          </Link>
        </div>
      </div>
      <h3 className="font-mono font-bold text-lg">{item.title}</h3>
      <p className="font-mono text-sm">{item.summary}</p>
    </div>
  )
}
