import axios from 'axios';
import Cookie from 'js-cookie';
import { encryptData, decryptData } from './enc_dec_admin.js';

const TOKEN_KEY = 'data';
const cookieData = Cookie.get('data');

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const setToken = (token) => {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.removeItem(TOKEN_KEY);
};

const getBaseUrl = () => {
  const ip = import.meta.env.VITE_IP || '';
  return ip.startsWith('http') ? ip : `http://${ip}`;
};

const createPayload = (additionalData = {}) => {
  return encodeURIComponent(encryptData({ data: cookieData, ...additionalData }));
};

/** GET /admin/auth/login/:data – :data is the encrypted payload (email, password, etc.) */
export const login = async (data) => {
  try {
    const baseUrl = getBaseUrl();
    const encodedData = createPayload(data);

    const response = await axios.get(
      `${baseUrl}/admin/auth/login/${encodedData}`
    );

    const encryptedPayload = response.data?.data;

    if (!encryptedPayload) {
      return { success: false, msg: 'Invalid server response' };
    }
    const encryptedMessage =response.data?.message

    const decrypted = decryptData(encryptedPayload);
    const decryptedMessage = encryptedMessage ? decryptData(encryptedMessage) : null;
    if (!decrypted) {
      return { success: false, msg: 'Unable to decrypt server response' };
    }

    if (
      decrypted === 'Login_Verified_Successfully_And_Response_Token_Sent' ||
      decryptedMessage === 'Login_Verified_Successfully_And_Response_Token_Sent'
    ) {
      const token = response.data?.data;
      if (token) setToken(token);
      return {
        success: true,
        data: decrypted,
        token,
        msg: 'Login successful',
      };
    }

    return { success: false, msg: 'Authentication failed' };
  } catch (error) {
    return {
      success: false,
      msg:
        error.response?.data?.message ||
        'Unable to reach server',
    };
  }
};
