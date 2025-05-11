import axios from 'axios';
import AuthService from './authService';

const API_URL = 'https://q7z3gp5k-8080.inc1.devtunnels.ms/api/news/';
const ADMIN_API_URL = 'https://q7z3gp5k-8080.inc1.devtunnels.ms/api/admin/';

// Helper function to get auth token
const getAuthHeader = () => {
  const currentUser = AuthService.getCurrentUser();
  if (currentUser && currentUser.token) {
    return { Authorization: 'Bearer ' + currentUser.token };
  } else {
    return {};
  }
};

// Fetch all news articles for admin view
const getAllNewsAdmin = () => {
  return axios.get(API_URL + 'admin/all', { headers: getAuthHeader() });
};

// Add a new news article
const addNewsArticle = (newsData: { title: string; summary: string; source?: string; sourceUrl?: string; category: string; }) => {
  const headers = getAuthHeader();
  console.log("addNewsArticle - Auth Header:", headers);
  return axios.post(API_URL + 'add', newsData, { headers });
};

// Delete a news article by ID
const deleteNewsArticle = (id: number) => {
  return axios.delete(API_URL + id, { headers: getAuthHeader() });
};

// Fetch public news articles (all users)
const getPublicNews = () => {
  return axios.get(API_URL + 'public');
};

// Manual trigger TechCrunch scraping (admin only)
const scrapeTechCrunch = () => {
  return axios.post(API_URL + 'admin/scrape-techcrunch', {}, { headers: getAuthHeader() });
};

// Get scraper status (admin only)
const getScraperStatus = () => {
  return axios.get(ADMIN_API_URL + 'scraper/status', { headers: getAuthHeader() });
};

// Toggle scraper enabled/disabled (admin only)
const toggleScraper = (enabled: boolean) => {
  return axios.post(ADMIN_API_URL + 'scraper/toggle?enabled=' + enabled, {}, { headers: getAuthHeader() });
};

// Toggle between JSoup and Firecrawl API (admin only)
const toggleFirecrawlApi = (useFirecrawl: boolean) => {
  return axios.post(ADMIN_API_URL + 'scraper/toggle-firecrawl?useFirecrawl=' + useFirecrawl, {}, { headers: getAuthHeader() });
};

// Run latest articles scraper (admin only)
const scrapeLatestTechCrunch = () => {
  return axios.post(ADMIN_API_URL + 'scraper/run-latest', {}, { headers: getAuthHeader() });
};

const NewsService = {
  getAllNewsAdmin,
  addNewsArticle,
  deleteNewsArticle,
  getPublicNews,
  scrapeTechCrunch,
  getScraperStatus,
  toggleScraper,
  toggleFirecrawlApi,
  scrapeLatestTechCrunch
};

export default NewsService; 