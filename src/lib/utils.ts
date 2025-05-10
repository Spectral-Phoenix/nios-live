import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatRelativeTime(timeString: string): string {
  const date = new Date(timeString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  
  // Convert to seconds
  const diffInSecs = Math.floor(diffInMs / 1000);
  
  // Less than a minute
  if (diffInSecs < 60) {
    return diffInSecs <= 5 ? 'just now' : `${diffInSecs} seconds ago`;
  }
  
  // Less than an hour
  const diffInMins = Math.floor(diffInSecs / 60);
  if (diffInMins < 60) {
    return `${diffInMins} ${diffInMins === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  // Less than a day
  const diffInHours = Math.floor(diffInMins / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  // Less than a week
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  // Fallback to actual date for older items
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
