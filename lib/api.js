
export async function apiRequest(route, data = {}, method = 'GET') {
  const headers = {
    'Content-Type': 'application/json',
  };

  const config = {
    method,
    headers,
    credentials: 'include', // envia las cookies
  };


  if (['POST', 'PUT', 'PATCH'].includes(method) && Object.keys(data).length > 0) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`http://localhost:8080${route}`, config);

    let responseData = null;
    
    // Primero obtener el texto de la respuesta
    const responseText = await response.text();
    
    try {
      // Intentar parsear como JSON
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch (parseError) {
      // Si falla el parseo JSON, usar el texto plano
      console.warn('Response is not JSON, using text:', responseText);
      responseData = { message: responseText };
    }

    if (!response.ok) {
      const errorMessage = 
        responseData?.error || 
        responseData?.message || 
        responseText || 
        `Error ${response.status}: ${response.statusText}`;
      
      throw new Error(errorMessage);
    }

    return {
      success: true,
      data: responseData,
      status: response.status,
    };
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      error: error.message,
      status: 500,
    };
  }
}


export const api = {
  get: (route) => apiRequest(route, {}, 'GET'),
  post: (route, data) => apiRequest(route, data, 'POST'),
  put: (route, data) => apiRequest(route, data, 'PUT'),
  patch: (route, data) => apiRequest(route, data, 'PATCH'),
  delete: (route) => apiRequest(route, {}, 'DELETE'),
};
