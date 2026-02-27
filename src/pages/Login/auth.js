import axios from 'axios';
import Cookie from 'js-cookie';
import { encryptData, decryptData } from '../../api/enc_dec_admin';

const TOKEN_KEY = 'data';
const ip = `${import.meta.env.VITE_IP}/admin/auth`;
const cookieData = Cookie.get('data');

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const setToken = (token) => {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.removeItem(TOKEN_KEY);
};

const createPayload = (additionalData = {}) => {
  return encodeURIComponent(encryptData({ data: cookieData, ...additionalData }));
};

export const login = async (data) => {
  try {
    const response = await axios.get(
      `${ip}/login/${createPayload(data)}`
    );
    if (response.status !== 200) {
      return { success: false, msg: 'Invalid response from server' };
    }
     const payload = response.data?.data;
     console.log("payload",payload);
     console.log("response",response);
    // if (payload == null) {
    //   return { success: false, msg: 'Invalid server response' };
    // }
    let decrypted = null;
    if (typeof payload === 'string') {
      try {
        decrypted = decryptData(response.data.message);
      } catch (err) {
        console.error('Decrypt error', err);
        return { success: false, msg: 'Invalid or unsupported response from server' };
      }
    } else if (typeof payload === 'object' && payload.message) {
      decrypted = payload.message;
    } else {
      decrypted = null;
    }
    console.log("decrypted",decrypted);
    const successMessage = 'Login_Verified_Successfully_And_Response_Token_Sent';
    if (decrypted === successMessage) {
      const token = response.data?.token || response.data?.data?.token;
      if (response.data?.data != null) {
        sessionStorage.setItem(
          'data',
          typeof response.data.data === 'string' ? response.data.data : JSON.stringify(response.data.data)
        );
      }
      if (token) setToken(token);
      return {
        success: true,
        data: response.data,
        token: token || undefined,
        msg: 'Login successful, OTP sent',
      };
    }
    return { success: false, msg: 'Authentication failed' };
  } catch (error) {
    console.error('Error in Login', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to login',
    };
  }
};