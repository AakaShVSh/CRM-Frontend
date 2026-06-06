import axios from "axios";
import toast from "react-hot-toast";

const baseUrl = "https://crm-frontend-grjk.onrender.com/api";
//const baseUrl = "http://localhost:8080/api";

export const getCustomerApi = async () => {
  try {
    const res = await axios.get(`${baseUrl}/all-customer`);
    const allCustomer = res.data;
    return allCustomer;
  } catch (error) {
    toast.error("This is an error!",error);
  }
};

export const addCustomerApi = async (data) => {
  try {
    const res = await axios.post(`${baseUrl}/add-customer`, data);
    const addedCustomer = res.data;
    toast.success("New Customer Added");
    return addedCustomer;
  } catch (error) {
        toast.error("This is an error!", error);

  }
};

export const updateCustomerApi = async (id,data) => {
  try {
    const res = await axios.patch(`${baseUrl}/update-customer/${id}`, data);
    const updatedCustomer = res.data;
    toast.success("Successfully Updated!");
    return updatedCustomer;
  } catch (error) {
        toast.error("This is an error!", error);

  }
};

export const deleteCustomerApi = async (id) => {
  try {
    const res = await axios.delete(`${baseUrl}/delete-customer/${id}`);
    const deleteCustomer = res.data;
    toast.success("Successfully Deleted!");
    return deleteCustomer;
  } catch (error) {
        toast.error("This is an error!", error);

  }
};

export const searchCustomerApi = async (search) => {
  try {
    const res = await axios.get(`${baseUrl}/search-customer?search=${search}`);
    const searchCustomer = res.data;
    return searchCustomer;
  } catch (error) {
        toast.error("This is an error!", error);
  }
};