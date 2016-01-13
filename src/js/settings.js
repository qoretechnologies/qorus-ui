export default {
  REST_API_PREFIX: process.env.REST_API_BASE_URL || '/api',
  DEFAULT_REST_HEADERS: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
};
