export function parseApiError(error) {
  const status = error.response?.status;
  const data = error.response?.data;

  if (status === 422) {
    const fieldErrors = Object.fromEntries(
      Object.entries(data.errors ?? {}).map(([field, messages]) => [field, messages[0]]),
    );
    return { message: data.message, fieldErrors };
  }

  if (status === 429) {
    return { message: 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.', fieldErrors: {} };
  }

  if (status) {
    return { message: data?.message ?? 'Ocurrió un error inesperado.', fieldErrors: {} };
  }

  return { message: 'No se pudo conectar con el servidor.', fieldErrors: {} };
}