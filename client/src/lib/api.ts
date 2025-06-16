// API utility functions for handling production/development environments

export const getApiUrl = (endpoint: string): string => {
  // In development, use local server
  if (import.meta.env.DEV) {
    return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  }
  
  // In production with static deployment, use external API or fallback
  // Check if we have a separate API URL for production
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (apiBaseUrl) {
    return `${apiBaseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }
  
  // Fallback: try the same domain (works if API is deployed separately)
  return `${window.location.origin}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

export const apiRequest = async (
  method: string,
  endpoint: string,
  data?: unknown,
  options: RequestInit = {}
): Promise<Response> => {
  const url = getApiUrl(endpoint);
  const token = localStorage.getItem('adminToken');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    ...options,
  };

  if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // If we get a 404 in production, API routes might not be available
      if (response.status === 404 && import.meta.env.PROD) {
        throw new Error('API_NOT_AVAILABLE');
      }
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
    
    return response;
  } catch (error) {
    // In production, if fetch fails entirely, the API server isn't available
    if (import.meta.env.PROD && (error instanceof TypeError || (error as Error).message === 'API_NOT_AVAILABLE')) {
      throw new Error('API_NOT_AVAILABLE');
    }
    throw error;
  }
};

export const apiGet = async (endpoint: string): Promise<Response> => {
  return apiRequest('GET', endpoint);
};

export const apiPost = async (endpoint: string, data: unknown): Promise<Response> => {
  return apiRequest('POST', endpoint, data);
};

export const apiPatch = async (endpoint: string, data: unknown): Promise<Response> => {
  return apiRequest('PATCH', endpoint, data);
};

export const apiDelete = async (endpoint: string): Promise<Response> => {
  return apiRequest('DELETE', endpoint);
};