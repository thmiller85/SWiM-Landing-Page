// API utility functions for handling production/development environments

export const getApiUrl = (endpoint: string): string => {
  const baseUrl = import.meta.env.PROD ? window.location.origin : '';
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

export const apiRequest = async (
  method: string,
  endpoint: string,
  data?: unknown,
  options: RequestInit = {}
): Promise<Response> => {
  const url = getApiUrl(endpoint);
  const token = localStorage.getItem('adminToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
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

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }
  
  return response;
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