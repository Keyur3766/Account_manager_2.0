import axios from 'axios';
import { saveAs } from 'file-saver';
import Cookie from 'js-cookie';
import authHeader from './authHeader';


// const API_BASE_URL = 'http://127.0.0.1:8081';
// const API_BASE_URL = process.env.REACT_APP_API_URL; 

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://127.0.0.1:8081";

export default {
  FetchCustomer: async function () {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/customers/getCustomers`, 
        {
          headers: authHeader()
        }
      );
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  Add_Supplier: async function (Name, Email, Address, City, Mobile) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/suppliers/addSupplier`, {
        Name: Name,
        Email: Email,
        Address: Address,
        City: City,
        Mobile: Mobile,
      });

      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  Add_Customer: async function (Name, Email, Address, City, Mobile) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/customers/addCustomer`, {
        Name: Name,
        Email: Email,
        Address: Address,
        City: City,
        Mobile: Mobile,
      });

      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  Add_Challan: async function (customer_id, item_id, quantity) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/challans/addChallans`, {
        customer_id: customer_id,
        item_id: item_id,
        quantity: quantity,
      });

      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  Add_Item: async function (Name, Purchase_price, Selling_price,Item_color,Total_stocks, file){
    try{
      console.log("From USerservices:",file);
      const response = await axios.post(`${API_BASE_URL}/api/items/addItems`,{
        Name: Name,
        purchase_price: Purchase_price,
        selling_price: Selling_price,
        item_color: Item_color,
        total_stocks: Total_stocks,
        file: file
      },{ headers: {'Content-Type': 'multipart/form-data'}});
      return response;
    }
    catch(error){
      console.log(error);
      return error;
    }
  },
  FetchItems: async function(){
    try{
      const response = await axios.get(`${API_BASE_URL}/api/items/getItems`,
      {
        headers: authHeader()
      });
      return response;
    }
    catch(error){
      console.log(error);
      return error;
    }
  },

  FetchSupplier: async function () {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/suppliers/getSuppliers`,
      {
        headers: authHeader()
      });
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  Customer_Delete: async function (id) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/customers/deleteCustomers/${id}`
      );
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  Supplier_Delete: async function (id) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/suppliers/deleteSuppliers/${id}`
      );
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  Item_Delete: async function (id) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/items/getItems/${id}`
      );
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  Get_ChallanCountById: async function(id){
    try{
      const response = await axios.get(
        `${API_BASE_URL}/api/challans/getChallanCount/${id}`
      );
      return response;
    }
    catch(error){
      console.log(error);
      return error;
    }
  },

  Get_ChallanDetailsById: async function(id){
    try{
      const response = await axios.get(
        `${API_BASE_URL}/api/challans/getChallanDetails/${id}`
      );
      return response;
    }
    catch(error){
      console.log(error);
      return error;
    }
  },

  Update_ChallanStatusById: async function(id){
    try{
      const response = await axios.put(
        `${API_BASE_URL}/api/challans/updateChallan/${id}`
      );
      return response;
    }
    catch(error){
      console.log(error);
      return error;
    }
  },

  DownloadChallan: async function(inputFields, customerName){
      console.warn(inputFields);
      await axios.post(
        `${API_BASE_URL}/api/challans/createChallanPDF`,{
          inputFields : inputFields,
          customerName: customerName
        }
      )
      .then(() =>  axios.get(`${API_BASE_URL}/api/challans/fetchPDF`, {responseType: 'blob'}))
      .then((res)=>{
        const pdfBlob = new Blob([res.data], {type: 'application/pdf'});
        saveAs(pdfBlob,'challans.pdf');
      });
  },

// Save and Download the Invoice
  SaveAndDownloadInvoice: async function(customerId, items){
      console.warn(customerId);
      console.warn(items);

      try{
        await axios.post(
          `${API_BASE_URL}/api/invoice/generateInvoice`, {
            customerId: customerId,
            items: items
          }
        )
        .then(()=> axios.get(`${API_BASE_URL}/api/invoice/fetchPDF`, {responseType: 'blob'}))
        .then((res)=>{
          const pdfBlob = new Blob([res.data], {type: 'application/pdf'});
          saveAs(pdfBlob,'invoice.pdf');
        });
      }
      catch(error){
        console.log(error);
      }
  },

  // Generate token for sign-in functionality
  GenerateLoginToken: async function(email, password){
    try{
      const response = await axios.post(
        `${API_BASE_URL}/api/login/generateToken`, {
          email: email,
          password: password
        }
      );

      if(response.status===200){
        Cookie.set('jwtToken', JSON.stringify(response.data), { expires: 1/24 });
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      console.warn(response)
      return response;
    }
    catch(error){
      console.log(error);   
      return error;
    }
  },
  // Remove token for Logout functioality
  RemoveToken: async function(){
    try{
      const response = await axios.post(
        `${API_BASE_URL}/api/login/logout`, {
        }
      );
      if(response.status===200){
        localStorage.removeItem("user");
        Cookie.remove('jwtToken');
      }
      return response;
    }
    catch(error){
      console.log(error);
      return error;
    }
  },

  UpdateStockIN: async function(id, quantity){
    try{
        const response = await axios.put(
          `${API_BASE_URL}/api/items/updateStockIn/${id}`,
          {
            quantity: quantity
          }
        );

        return response;
    }
    catch(error){
      console.log(error);
      return error;
    }
  },
  UpdateStockOUT: async function(id, quantity){
    try{
        const response = await axios.put(
          `${API_BASE_URL}/api/items/updateStockOut/${id}`,
          {
            quantity: quantity
          }
        );

        return response;
    }
    catch(error){
      console.log(error);
      return error;
    }
  },

  FetchTransactions: async function(id){
    try{
      const response = await axios.get(
        `${API_BASE_URL}/api/transactions/getTransactionById/${id}`
      )
      return response;
    }
    catch(error){
      console.log(error);
      return error;
    }
  },

  FetchCustomerByID: async function(id){
    try{
      const response = await axios.get(
        `${API_BASE_URL}/api/customers/getCustomers/${id}`
      )
      return response;
    }
    catch(error){
      console.log(error);
      return error;
    }
  },
  AddTransaction: async function(id,amount,purpose){
    try{
      const response = await axios.post(
        `${API_BASE_URL}/api/transactions/addTransaction`, {
          customer_id: id,
          amount: amount,
          purpose: purpose
        }
      )
      return response;
    }
    catch(error){
      console.log(error);
      return error;
    }
  },
  GetTransactionAmountById: async function(id){
    try{
      const response = await axios.get(
        `${API_BASE_URL}/api/transactions/getTransactionAmountById/${id}`
      )
      return response;
    }
    catch(error){
      console.log(error);
      return error;
    }
  },

  PendingAmount: async function(){
    try{
      const response = await axios.get(
        `${API_BASE_URL}/api/dashboard/PendingAmount`
      )
      return response;
    }
    catch(error){
      console.log(error);
      return error;
    }
  },

  EstimatedProfit: async function(){
    try{
      const response = await axios.get(
        `${API_BASE_URL}/api/dashboard/EstimatedProfit`
      )
      return response;
    }
    catch(error){
      console.log(error);
      return error;
    }
  },

  MonthlySales: async function(){
    try{
      const response = await axios.get(
        `${API_BASE_URL}/api/dashboard/MonthlySales`
      )
      return response;
    }
    catch(error){
      console.log(error);
      return error;
    } 
  },

  TotalCustomers: async function(){
    try{
      const response = await axios.get(
        `${API_BASE_URL}/api/dashboard/totalCustomers`
      )
      return response;
    }
    catch(error){
      console.log(error);
      return error;
    } 
  }

}
