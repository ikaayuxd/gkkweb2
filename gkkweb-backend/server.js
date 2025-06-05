const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

const MONGODB_URI = "mongodb+srv://aayu:909090gg@aayu.vgpfl.mongodb.net/?retryWrites=true&w=majority&appName=aayu";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const orderSchema = new mongoose.Schema({
  buyerName: String,
  cart: Object,
  totalValue: Number,
  orderDate: String,
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

app.use(cors());
app.use(bodyParser.json());

// Save order
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: 'Order saved successfully' });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
