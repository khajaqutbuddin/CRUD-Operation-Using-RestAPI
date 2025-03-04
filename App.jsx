import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [editing, setEditing] = useState(false);
  const [customers, setCustomers] = useState([]); // All Customers
  const [form, setForm] = useState({
    // Current Customer
    id: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "Male",
    dob: "1990-05-15",
    anniversary: "2020-08-20",
    state: "California",
    address: "123 Main St, Los Angeles, CA 90001",
    taxNumber: "123-45-6789",
    promotionSms: true,
    promotionEmail: false,
    transactionSms: true,
    transactionEmail: true,
    leadSource: "Website",
    sourceDesc: "Signed up through the landing page",
    customerReferral: false,
  });

  const API_BASE = "https://stellam.in:8082/customers";

  // Fetch all Customers
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/all`);
      setCustomers(response.data);
    } catch (error) {
      console.log(
        "fetch Customer error:",
        error.response?.data || error.message
      );
    }
  };

  // Create new Customer
  const createCustomer = async () => {
    try {
      const response =  await axios.post(`${API_BASE}/create`, form) ;
      console.log("Customer Created:", response.data);
      resetForm();
      fetchCustomers(); // Refresh list
    } catch (error) {
      console.log(
        "Creating Customer error:",
        error.response?.data || error.message
      );
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Delete Customer
  const deleteCustomer = async (id) => {
    try {
      axios.delete(`${API_BASE}/${id}`);
      fetchCustomers();
    } catch (error) {
      console.log(
        "Deleting Customer Error:",
        error.response?.data || error.message
      );
    }
  };

  // Update Customer
  const updateCustomer = async () => {
    try {
      await axios.put(`${API_BASE}/${form.id}`, form); ///customers/{id}
      fetchCustomers();
      resetForm();
      setEditing(false);
    } catch (error) {
      console.log(
        "Updating Customer Error:",
        error.response?.data || error.message
      );
    }
  };

  // Edit Existing Customer
  const editCustomer = (customer) => {
    setForm(customer);
    setEditing(true);
  };

  // Reset Form
  const resetForm = () => {
    setForm({
      id: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      gender: "Male",
      dob: "1990-05-15",
      anniversary: "2020-08-20",
      state: "California",
      address: "123 Main St, Los Angeles, CA 90001",
      taxNumber: "123-45-6789",
      promotionSms: true,
      promotionEmail: false,
      transactionSms: true,
      transactionEmail: true,
      leadSource: "Website",
      sourceDesc: "Signed up through the landing page",
      customerReferral: false,
    });
    setEditing(false);
  };

  useEffect(() => {
    const getCustomers = async () => {
      await fetchCustomers();
    };
    getCustomers();
  }, []);

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      updateCustomer();
    } else {
      createCustomer();
    }
    console.log("Form Submitted");
  };

  return (
    <>
      <h1>Customer CRUD Operations</h1>

      <form onSubmit={handleSubmit}>
        {editing && (
          <div>
            <label>ID:</label>
            <input type="text" name="id" value={form.id} readOnly />
          </div>
        )}
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <button type="submit">
          {editing ? "Update Customer" : "Create Customer"}
        </button>
        <button type="button" onClick={resetForm}>
          Clear
        </button>
      </form>

      <h2>Customer List ({customers.length})</h2>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            {customer.firstName} {customer.lastName} - {customer.email}
            <button onClick={() => editCustomer(customer)}>Edit</button>
            <button onClick={() => deleteCustomer(customer.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
