import axios from 'axios';
import AuthService from './authService';

const API_URL = 'http://localhost:8080/api/bookmarks/';

// Helper function to get auth token
const getAuthHeader = () => {
  const currentUser = AuthService.getCurrentUser();
  if (currentUser && currentUser.token) {
    return { Authorization: 'Bearer ' + currentUser.token };
  } else {
    return {};
  }
};

// Get all bookmarks for current user
const getUserBookmarks = () => {
  return axios.get(API_URL + 'user', { headers: getAuthHeader() });
};

// Check if an article is bookmarked
const checkBookmark = (articleId: number) => {
  return axios.get(API_URL + 'check/' + articleId, { headers: getAuthHeader() });
};

// Add a bookmark
const addBookmark = (articleId: number) => {
  return axios.post(API_URL + 'add/' + articleId, {}, { headers: getAuthHeader() });
};

// Remove a bookmark
const removeBookmark = (articleId: number) => {
  return axios.delete(API_URL + 'remove/' + articleId, { headers: getAuthHeader() });
};

const BookmarkService = {
  getUserBookmarks,
  checkBookmark,
  addBookmark,
  removeBookmark
};

export default BookmarkService; 