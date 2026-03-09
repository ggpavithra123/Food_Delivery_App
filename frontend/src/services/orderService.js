import axios from 'axios';

// export const createOrder = async order => {
//   try {
//     console.log("Order is:",order);
//     const { data } = await axios.post('http://localhost:5000/api/orders/create', order);
//     // Save order to localStorage
//     // localStorage.setItem('newOrder', JSON.stringify(data));
//     // console.log('🧾 Order saved to localStorage:', data);
//     return data;
//   } catch (error) {}
// };

export const createOrder = async order => {
  try {
    console.log("Order is:", order);

    const { data } = await axios.post(
      'http://localhost:5000/api/orders/create',
      order
    );

    // ✅ Save order to localStorage
    localStorage.setItem("newOrder", JSON.stringify(data));

    console.log("Order saved:", data);

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getNewOrder = async () => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get("http://localhost:5000/api/orders/getNewOrder", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

// export const getNewOrderForCurrentUser = async () => {
//   const { data } = await axios.get('http://localhost:5000/api/orders/newOrderForCurrentUser');
//   console.log("data is:",data);
//   return data;
// };

export const getNewOrderForCurrentUser = async () => {
  const token = localStorage.getItem("token");

  const { data } = await axios.get(
    "http://localhost:5000/api/orders/newOrderForCurrentUser",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const pay = async paymentId => {
  try {
    const { data } = await axios.put('http://localhost:5000/api/orders/pay', { paymentId });
    return data;
  } catch (error) {}
};

export const trackOrderById = async orderId => {
  const { data } = await axios.get('http://localhost:5000/api/orders/track/' + orderId);
  return data;
};

export const getAll = async state => {
  const { data } = await axios.get(`http://localhost:5000/api/orders/${state ?? ''}`);
  return data;
};

export const getAllStatus = async () => {
  const { data } = await axios.get(`http://localhost:5000/api/orders/allstatus`);
  return data;
};