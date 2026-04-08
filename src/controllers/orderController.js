const express = require("express");
const orderService = require("../services/orderService");
const errorResponse = require("../util/errorResponse");
const productService = require("../services/productService");

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         productid:
 *           type: integer
 *         count:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [pending, fulfilled, cancelled]
 */

/**
 * @openapi
 * /orders:
 *   get:
 *     summary: Search orders
 *     tags: [Orders]
 *     parameters:
 *       - name: productid
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *       - name: status
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [pending, fulfilled, cancelled]
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseBody'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseBody'
 */
router.get("/", async (req, res) => {
  const { productid, status } = req.query;
  const orders = orderService.searchOrders(productid, status);
  return res.status(200).json(orders);
});

/**
 * @openapi
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productid, count]
 *             properties:
 *               productid:
 *                 type: integer
 *               count:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseBody'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseBody'
 */
router.post("/", async (req, res) => {
  const { count, productid } = req.body;
  if (!productService.getProductById(productid)) {
    return errorResponse(
      res,
      404,
      "Not Found",
      `Cannot add Order, Product with ID ${productid} not found`,
    );
  }
  const orderId = orderService.addOrder(productid, count);
  return res.status(200).json({ id: orderId });
});

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseBody'
 */
router.get("/:id", async (req, res) => {
  const id = Number.parseInt(req.params.id);
  const order = orderService.getOrderById(id);
  if (!order) {
    return errorResponse(
      res,
      404,
      "Not Found",
      `Order with id ${id} not found`,
    );
  }
  return res.status(200).json(order);
});

/**
 * @openapi
 * /orders/{id}:
 *   post:
 *     summary: Update order details
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productid:
 *                 type: integer
 *               count:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [pending, fulfilled, cancelled]
 *     responses:
 *       200:
 *         description: Update successful
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Successfully updated order with id 10"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseBody'
 */
router.post("/:id", async (req, res) => {
  const id = Number.parseInt(req.params.id);
  const { status, count, productid } = req.body;
  const isUpdateSuccessful = orderService.updatedOrderById(id, {
    productid,
    count,
    status,
  });
  if (!isUpdateSuccessful) {
    return errorResponse(
      res,
      404,
      "Not Found",
      `Order with id ${id} not found`,
    );
  }
  return res
    .status(200)
    .type("text/plain")
    .send(`Successfully updated order with id ${id}`);
});

/**
 * @openapi
 * /orders/{id}:
 *   delete:
 *     summary: Cancel/delete an order
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deletion successful
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Successfully deleted order with id 10"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseBody'
 */
router.delete("/:id", async (req, res) => {
  const id = Number.parseInt(req.params.id);
  const isDeleteSuccessful = orderService.deleteOrderById(id);
  if (!isDeleteSuccessful) {
    return errorResponse(
      res,
      404,
      "Not Found",
      `Order with id ${id} not found`,
    );
  }
  return res
    .status(200)
    .type("text/plain")
    .send(`Successfully deleted order with id ${id}`);
});

module.exports = router;
