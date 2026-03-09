import React, { useState, useEffect } from 'react';
import classes from './paymentPage.module.css';
import { getNewOrderForCurrentUser,getNewOrder } from '../../services/orderService';
import Title from '../../components/Title/Title';
import OrderItemsList from '../../components/OrderItemsList/OrderItemsList';
import Map from '../../components/Map/Map';
import PaypalButtons from '../../components/PaypalButtons/PaypalButtons';
//import { data } from 'react-router-dom';

export default function PaymentPage() {
  const [order, setOrder] = useState();

//   useEffect(() => {

//   //const getNewOrder = localStorage.getItem("")
//   console.log("🚀 Fetching new order for current user...");
//   const getNewOrder = JSON.parse(localStorage.getItem("newOrder"));
//   setOrder(getNewOrder);
//   console.log("getNewOrder...",order);
//   // console.log("🚀 Fetching new order for current user...");
//   // getNewOrder()
//   //   .then((data) => {
//   //     console.log("✅ Order data received:", data);
//   //     setOrder(data);
//   //   })
//   //   .catch((error) => {
//   //     console.error("❌ Failed to fetch new order:", error);
//   //   });
// }, []);
useEffect(() => {
    console.log("before getNewOrderForCurrentUser in payment:")
    const getNewOrder = JSON.parse(localStorage.getItem("newOrder"));
    setOrder(getNewOrder);
    //getNewOrder().then(data => setOrder(data));
    //console.log("after getNewOrderForCurrentUser in payment:",data)
  }, []);

if (!order) {
  //setOrder(order);
  //console.log("getNewOrder...",order);
  return <p>Loading...</p>;
}


  

  // if (!order) return;

  return (
    <>
      <div className={classes.container}>
        <div className={classes.content}>
          <Title title="Order Form" fontSize="1.6rem" />
          <div className={classes.summary}>
            <div>
              <h3>Name:</h3>
              <span>{order.name}</span>
            </div>
            <div>
              <h3>Address:</h3>
              <span>{order.address}</span>
            </div>
          </div>
          <OrderItemsList order={order} />
        </div>

        <div className={classes.map}>
          <Title title="Your Location" fontSize="1.6rem" />
          <Map readonly={true} location={order.addressLatLng} />
        </div>

        <div className={classes.buttons_container}>
          <div className={classes.buttons}>
            <PaypalButtons order={order} />
          </div>
        </div>
      </div>
    </>
  );
}
