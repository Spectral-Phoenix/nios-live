import axios from 'axios';

// Fetch news from the Spring Boot backend
export async function fetchNews() {
  console.log('Attempting to fetch news from Spring Boot backend...');
  
  try {
    const response = await axios.get('https://q7z3gp5k-8080.inc1.devtunnels.ms/api/news/public');
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    
    // Fallback to mock data in case the backend is not available
    console.log('Using fallback mock data');
    return [
      {
        title: "OpenAI Announces GPT-5 with Enhanced Reasoning Capabilities",
        summary:
          "OpenAI has unveiled GPT-5, featuring significant improvements in reasoning, coding, and multimodal understanding. The new model shows a 30% reduction in hallucinations compared to GPT-4.",
        source: "TechCrunch",
        sourceUrl: "https://techcrunch.com",
        category: "ai",
        time: "2 hours ago",
      },
      {
        title: "GitHub Copilot Introduces New Code Review Features",
        summary:
          "GitHub has expanded Copilot with automated code review capabilities that can suggest security improvements and identify potential bugs before code is committed.",
        source: "GitHub Blog",
        sourceUrl: "https://github.blog",
        category: "dev",
        time: "4 hours ago",
      },
      {
        title: "TypeScript 5.4 Released with Performance Improvements",
        summary:
          "Microsoft has released TypeScript 5.4, featuring significant compiler performance improvements and new type checking features that enhance developer productivity.",
        source: "Microsoft DevBlog",
        sourceUrl: "https://devblogs.microsoft.com",
        category: "dev",
        time: "6 hours ago",
      },
      {
        title: "Backend Connection Failed - Please Start Spring Boot Server",
        summary:
          "Unable to connect to the backend server. Please make sure the Spring Boot backend is running on port 8080.",
        source: "System",
        sourceUrl: "#",
        category: "dev",
        time: "just now",
      },
    ];
  }
}
  