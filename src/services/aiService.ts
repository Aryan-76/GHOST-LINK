const REQUEST_TIMEOUT = 30000; // 30 seconds

async function fetchWithTimeout(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }
}

interface ChatResponse {
  text: string;
}

interface SearchResponse {
  briefing: string;
  sources: { title: string; url: string }[];
}

export const aiService = {
  async chat(
    message: string,
    history: { role: string; parts: { text: string }[] }[] = [],
  ): Promise<ChatResponse> {
    const response = await fetchWithTimeout('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Something went wrong. Please try again.');
    }

    return response.json();
  },

  async search(query: string): Promise<SearchResponse> {
    const response = await fetchWithTimeout('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Search failed. Please try again.');
    }

    return response.json();
  },

  async executeCommand(command: string): Promise<any> {
    const response = await fetchWithTimeout('/api/commands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Action failed. Please try again.');
    }

    return response.json();
  },
};
