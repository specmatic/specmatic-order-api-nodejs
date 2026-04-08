const express = require("express");
const productService = require("../services/productService");
const errorResponse = require("../util/errorResponse");

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     ErrorResponseBody:
 *       type: object
 *       properties:
 *         timestamp:
 *           type: string
 *           format: date-time
 *         status:
 *           type: integer
 *         error:
 *           type: string
 *         message:
 *           type: string
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         type:
 *           type: string
 *           enum: [gadget, book, food, other]
 *         inventory:
 *           type: integer
 */

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Search products by type
 *     tags: [Products]
 *     parameters:
 *       - name: type
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [gadget, book, food, other]
 *         description: Filter products by type
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseBody'
 */
router.get("/", async (req, res) => {
  const { type } = req.query;
  const products = productService.searchProducts(type);
  return res.json(products);
});

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type, inventory]
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [gadget, book, food, other]
 *               inventory:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product created successfully
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
  const { name, type, inventory } = req.body;
  const productId = productService.addProduct(name, type, inventory);
  return res.status(200).json({ id: productId });
});

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseBody'
 */
router.get("/:id", async (req, res) => {
  const id = Number.parseInt(req.params.id);
  const product = productService.getProductById(id);

  if (!product) {
    return errorResponse(
      res,
      404,
      "Not Found",
      `Product with id ${id} not found`,
    );
  }

  return res.status(200).json(product);
});

/**
 * @openapi
 * /products/{id}:
 *   post:
 *     summary: Update product details
 *     tags: [Products]
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
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [gadget, book, food, other]
 *               inventory:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Update successful
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Successfully updated product with id 10"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseBody'
 */
router.post("/:id", async (req, res) => {
  const id = Number.parseInt(req.params.id);
  const { name, type, inventory } = req.body;
  const isUpdateSuccessful = productService.updateProductById(id, {
    name,
    type,
    inventory,
  });
  if (!isUpdateSuccessful) {
    return errorResponse(
      res,
      404,
      "Not Found",
      `Product with id ${id} not found`,
    );
  }
  return res
    .status(200)
    .type("text/plain")
    .send(`Successfully updated product with id ${id}`);
});

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
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
 *               example: "Successfully deleted product id: 10"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseBody'
 */
router.delete("/:id", async (req, res) => {
  const id = Number.parseInt(req.params.id);
  const isDeleteSuccessful = productService.deleteProductById(id);

  if (!isDeleteSuccessful) {
    return errorResponse(
      res,
      404,
      "Not Found",
      `Product with id ${id} not found`,
    );
  }
  return res
    .status(200)
    .type("text/plain")
    .send(`Successfully deleted product id: ${id}`);
});

/**
 * @openapi
 * /products/{id}/image:
 *   put:
 *     summary: Upload product image
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: No file uploaded
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "No image file uploaded"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseBody'
 */
router.put("/:id/image", async (req, res) => {
  if (!req.files) {
    return res.status(400).send("No image file uploaded");
  }

  const id = Number.parseInt(req.params.id);
  const isUpdateSuccessful = productService.updateProductImageById(
    id,
    req.files[0],
  );
  if (!isUpdateSuccessful) {
    // TODO: Add example id in openAPI Specification on order_api_v3.yaml
    return res.json({
      productId: id,
      message: "Product image updated successfully",
    });
    // return errorResponse(res,404,"Not Found",`Product with id ${id} not found`,);
  }
  return res.json({
    productId: id,
    message: "Product image updated successfully",
  });
});

module.exports = router;
