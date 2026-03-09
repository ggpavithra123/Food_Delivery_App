import { Router } from 'express';
import handler from 'express-async-handler';
import auth from '../middleware/auth.mid.js';
import { BAD_REQUEST } from '../constants/httpStatus.js';
import { OrderModel } from '../models/order.model.js';
import { OrderStatus } from '../constants/orderStatus.js';
import { UserModel } from '../models/user.model.js';
import { sendEmailReceipt } from '../helpers/mail.helper.js';

const router = Router();
router.use(auth);

router.post(
  '/create',
  auth,
  handler(async (req, res) => {
    const order = req.body;

    if (order.items.length <= 0)
      return res.status(BAD_REQUEST).send('Cart Is Empty!');

    console.log("Order is routes:", order);
    console.log("User is:", req.user);

    await OrderModel.deleteOne({
      user: req.user.id,
      status: OrderStatus.NEW,
    });

    const newOrder = new OrderModel({
      ...order,
      user: req.user.id,
    });

    await newOrder.save();

    res.send(newOrder);
  })
);

router.put(
  '/pay',
  handler(async (req, res) => {
    const { paymentId } = req.body;
    const order = await getNewOrderForCurrentUser(req);
    if (!order) {
      res.status(BAD_REQUEST).send('Order Not Found!');
      return;
    }

    order.paymentId = paymentId;
    order.status = OrderStatus.PAYED;
    await order.save();

    sendEmailReceipt(order);

    res.send(order._id);
  })
);

router.get(
  '/track/:orderId',
  handler(async (req, res) => {
    const { orderId } = req.params;
    const user = await UserModel.findById(req.user.id);

    const filter = {
      _id: orderId,
    };

    if (!user.isAdmin) {
      filter.user = user._id;
    }

    const order = await OrderModel.findOne(filter);

    if (!order) return res.send(UNAUTHORIZED);

    return res.send(order);  
  })
);



router.get('/allstatus', (req, res) => {
  const allStatus = Object.values(OrderStatus);
  res.send(allStatus);
});

// // Get all orders
router.get('/', handler(async (req, res) => {
  const user = await UserModel.findById(req.user.id);
  const filter = {};

  if (!user.isAdmin) filter.user = user._id;

  const orders = await OrderModel.find(filter).sort('-createdAt');
  res.send(orders);
}));

// Get orders by status
router.get('/:status', handler(async (req, res) => {
  const { status } = req.params;
  const user = await UserModel.findById(req.user.id);
  const filter = { status };

  if (!user.isAdmin) filter.user = user._id;

  const orders = await OrderModel.find(filter).sort('-createdAt');
  res.send(orders);
}));

// router.get(
//   '/:status',
//   handler(async (req, res) => {
//     const status = req.params.status;
//     const user = await UserModel.findById(req.user.id);
//     const filter = {};

//     if (!user.isAdmin) filter.user = user._id;
//     if (status) filter.status = status;

//     const orders = await OrderModel.find(filter).sort('-createdAt');
//     res.send(orders);
//   })
// );

router.get(
  '/newOrderForCurrentUser',
  handler(async (req, res) => {
    try {
      console.log("🟡 [API Call] /newOrderForCurrentUser triggered");

      // Check if request and user exist
      if (!req) {
        console.error("❌ Request object is missing!");
        return res.status(400).send({ message: "Invalid request object" });
      }

      console.log("📩 Request headers:", req.headers);

      if (!req.user) {
        console.error("❌ req.user not found — JWT middleware may not be working");
        return res.status(401).send({ message: "Unauthorized: No user in request" });
      }

      console.log("👤 Authenticated user:", req.user);

      const order = await getNewOrderForCurrentUser(req);
      console.log("✅ Result from getNewOrderForCurrentUser:", order);

      if (order) {
        res.send(order);
      } else {
        console.warn("⚠️ No NEW order found for user:", req.user.id);
        res.status(404).send({ message: "No new order found" });
      }

    } catch (error) {
      console.error("💥 Error in /newOrderForCurrentUser:", error);
      res.status(500).send({ error: error.message });
    }
  })
);

router.get(
  '/getNewOrder',  // ✅ Renamed endpoint (was /newOrderForCurrentUser)
  handler(async (req, res) => {
    try {
      console.log("🟢 [API Call] /getNewOrder triggered");

      // ✅ Step 1: Validate request
      if (!req) {
        console.error("❌ Request object missing!");
        return res.status(400).send({ message: "Invalid request object" });
      }

      console.log("📩 Request headers:", req.headers);

      if (!req.user) {
        console.error("🚫 Unauthorized: req.user missing — JWT middleware may not be attached");
        return res.status(401).send({ message: "Unauthorized: User not found in request" });
      }

      console.log("👤 Authenticated user info:", req.user);

      // ✅ Step 2: Fetch user's new order
      console.log("🔎 Fetching user's new order...");
      const order = await getNewOrderForCurrentUser(req);

      // ✅ Step 3: Handle result
      if (order) {
        console.log("✅ New order found:", order._id);
        res.status(200).send(order);
      } else {
        console.warn("⚠️ No NEW order found for user:", req.user.id);
        res.status(404).send({ message: "No new order found for this user" });
      }

    } catch (error) {
      // ✅ Step 4: Error handling
      console.error("💥 [Error] /getNewOrder:", error.message);
      console.error("🧩 Stack trace:", error.stack);
      res.status(500).send({ message: "Internal server error", error: error.message });
    }
  })
);


// router.get(
//   '/newOrderForCurrentUser',
//   handler(async (req, res) => {
//     console.log("before getNewOrderForCurrentUser api call:",req);
//     const order = await getNewOrderForCurrentUser(req);
//     console.log("newOrderForCurrentUser:",order);
//     if (order) res.send(order);
//     else res.status(BAD_REQUEST).send();
//   })
// );

// router.get('/allstatus', (req, res) => {
//   const allStatus = Object.values(OrderStatus);
//   res.send(allStatus);
// });

// router.get(
//   '/:status?',
//   handler(async (req, res) => {
//     const status = req.params.status;
//     const user = await UserModel.findById(req.user.id);
//     const filter = {};

//     if (!user.isAdmin) filter.user = user._id;
//     if (status) filter.status = status;

//     const orders = await OrderModel.find(filter).sort('-createdAt');
//     res.send(orders);
//   })
// );

// const getNewOrderForCurrentUser = async req =>

//   console.log("user for getNewOrderForCurrentUser:",req);
//   await OrderModel.findOne({
//     user: req.user.id,
//     status: OrderStatus.NEW,
//   }).populate('user');
const getNewOrderForCurrentUser = async (req) => {
  console.log("📦 [getNewOrderForCurrentUser] Called");

  try {
    // ✅ 1. Validate user
    if (!req || !req.user || !req.user.id) {
      console.error("🚫 Missing user info in request:", req);
      throw new Error("User not found in request. Authentication required.");
    }

    console.log("👤 Authenticated User ID:", req.user.id);

    // ✅ 2. Query order
    console.log("🔎 Searching for NEW order for user...");
    const order = await OrderModel.findOne({
      user: req.user.id,
      status: OrderStatus.NEW,
    }).populate("user");

    // ✅ 3. Check result
    if (!order) {
      console.warn("⚠️ No NEW order found for user:", req.user.id);
      return null;
    }

    console.log("✅ Order found:", order._id);
    console.log("🧾 Order details:", {
      itemsCount: order.items?.length,
      status: order.status,
      totalPrice: order.totalPrice,
    });

    // ✅ 4. Return
    return order;
  } catch (error) {
    console.error("💥 [getNewOrderForCurrentUser] Error:", error.message);
    console.error("🧩 Stack trace:", error.stack);
    throw error;
  }
};


export default router;
