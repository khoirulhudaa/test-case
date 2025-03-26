import axios from 'axios';

// Buat instance Axios
const apiClient = axios.create({
  baseURL: 'https://648c14858620b8bae7ec2f7e.mockapi.io',
  timeout: 10000,
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Modifikasi config sebelum request dikirim
    console.log('Request dikirim:', config.method, config.url);
    return config;
  },
  (error) => {
    // Tangani error sebelum request dikirim
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Modifikasi response sebelum diteruskan
    console.log('Response diterima:', response.status);
    return response; // Kembalikan response asli
  },
  (error) => {
    // Tangani error dari response
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.error('Unauthorized! Mungkin token expired.');
        // Contoh: Redirect ke login
        // window.location.href = '/login';
      } else if (status >= 500) {
        console.error('Server error!');
      }
    } else {
      console.error('Network error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Fungsi untuk mengambil daftar pengguna
export const fetchUsers = async () => {
  const response = await apiClient.get('/barang');
  console.log('data barang:', response?.data)
  return response.data;
};

export default apiClient;