import axios from 'axios';
import { encryptData, decryptData } from '../../../api/enc_dec_admin.js';

const getBaseUrl = () => {
  const ip = import.meta.env.VITE_IP || '';
  const base = ip.startsWith('http') ? ip : `http://${ip}`;
  return base.replace(/\/$/, '');
};

const CookieData = sessionStorage.getItem('data');

const createEncodedPayload = (additionalData = {}) => {
  return encodeURIComponent(encryptData({ data: CookieData, ...additionalData }));
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
  const encodedData = createEncodedPayload(mapToApi(person));

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

export const editSalesMan = async (id, person) => {
  const baseUrl = getBaseUrl();
  const encodedData = createEncodedPayload({ _id: id, ...mapToApi(person) });

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

export const fetchSalesMen = async () => {
  const baseUrl = getBaseUrl();
  const encodedData = createEncodedPayload({});

  const response = await axios.get(
    `${baseUrl}/master/sales-man/fetch/${encodedData}`
  );

  if (response.data?.data) {
    try {
      sessionStorage.setItem('data', response.data.data);
      const decrypted = decryptData(response.data.data);
      const list = Array.isArray(decrypted) ? decrypted : [decrypted];
      return list.map(mapFromApi);
    } catch {
      return [];
    }
  }
  return [];
};

export const deleteSalesMan = async (id) => {
  const baseUrl = getBaseUrl();
  const encodedData = createEncodedPayload({ _id: id });

  const response = await axios.get(
    `${baseUrl}/master/sales-man/delete/${encodedData}`
  );

  return response.data;
};
