import axios from 'axios';
import Cookie from 'js-cookie';
import { encryptData, decryptData } from './enc.dec_admin.js';

const cookieData = Cookie.get('data');

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

    const encryptedPayload =response.data?.data;
        console.log("1   ",encryptedPayload);

    if (!encryptedPayload) {
      console.log("2   ",encryptedPayload);
      return { success: false, msg: 'Invalid server response' };
    }
    const encryptedMessage =response.data?.message

    const decrypted = decryptData(encryptedPayload);
    const decryptedMessage = decryptData(encryptedMessage);
    console.log("3   ",decrypted);
    if (!decrypted) {
      return { success: false, msg: 'Unable to decrypt server response' };
    }

    if (
      decrypted === 'Login_Verified_Successfully_And_Response_Token_Sent' ||
      decryptedMessage === 'Login_Verified_Successfully_And_Response_Token_Sent'
    ) {
      return {
        success: true,
        data: decrypted,
        msg: 'Login successful, OTP sent',
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
