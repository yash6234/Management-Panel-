import axios from 'axios';
import { encryptData, decryptData } from './enc.dec_admin.js';
import { getToken } from './auth.js';

const getBaseUrl = () => {
  const ip = import.meta.env.VITE_IP || '';
  const base = ip.startsWith('http') ? ip : `http://${ip}`;
  return base.replace(/\/$/, '');
};

const createEncodedPayload = (payload) => {
  const token = getToken();
  const data = token ? { token, ...payload } : payload;
  return encodeURIComponent(encryptData(data));
};

/** Map API response to app format */
const mapFromApi = (item) => ({
  id: item._id || item.id,
  _id: item._id,
  name: item.name,
  mobile: item.mobile_no,
  email: item.email,
  address: item.address,
});

/** Map app format to API format */
const mapToApi = (item) => ({
  name: item.name,
  mobile_no: item.mobile,
  email: item.email,
  address: item.address,
});

export const addSalesMan = async (person) => {
  const baseUrl = getBaseUrl();
  const payload = mapToApi(person);
  const encodedData = createEncodedPayload(payload);

  const response = await axios.get(
    `${baseUrl}/master/sales-man/add/${encodedData}`
  );

  if (response.data?.data) {
    try {
      const decrypted = decryptData(response.data.data);
      return Array.isArray(decrypted) ? decrypted.map(mapFromApi) : [mapFromApi(decrypted)];
    } catch {
      return response.data;
    }
  }
  return response.data;
};

/**
 * Edit person - GET /master/sales-man/edit/:data
 * Payload: { _id, name, mobile_no, email, address }
 */
export const editSalesMan = async (id, person) => {
  const baseUrl = getBaseUrl();
  const payload = { _id: id, ...mapToApi(person) };
  const encodedData = createEncodedPayload(payload);

  const response = await axios.get(
    `${baseUrl}/master/sales-man/edit/${encodedData}`
  );

  if (response.data?.data) {
    try {
      const decrypted = decryptData(response.data.data);
      return Array.isArray(decrypted) ? decrypted.map(mapFromApi) : [mapFromApi(decrypted)];
    } catch {
      return response.data;
    }
  }
  return response.data;
};

/**
 * Fetch all persons - GET /master/sales-man/fetch/:data
 */
export const fetchSalesMen = async () => {
  const baseUrl = getBaseUrl();
  const encodedData = createEncodedPayload({});

  const response = await axios.get(
    `${baseUrl}/master/sales-man/fetch/${encodedData}`
  );

  if (response.data?.data) {
    try {
      const decrypted = decryptData(response.data.data);
      const list = Array.isArray(decrypted) ? decrypted : [decrypted];
      return list.map(mapFromApi);
    } catch {
      return [];
    }
  }
  return [];
};

/**
 * Delete person - GET /master/sales-man/delete/:data
 * Payload: { _id }
 */
export const deleteSalesMan = async (id) => {
  const baseUrl = getBaseUrl();
  const payload = { _id: id };
  const encodedData = createEncodedPayload(payload);

  const response = await axios.get(
    `${baseUrl}/master/sales-man/delete/${encodedData}`
  );

  return response.data;
};
