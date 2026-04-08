const express = require("express");
const path = require("node:path");

const productsController = require("./controllers/productController");
const ordersController = require("./controllers/orderController");
const OpenApiValidator = require("express-openapi-validator");
const errorResponse = require("./util/errorResponse");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "static/uploads")));
app.use(
  OpenApiValidator.middleware({
    apiSpec: "./specmatic/openapi.v1.yaml",
    validateRequests: true,
    validateResponses: false,
    ignorePaths: /.*\/favicon.*/,
    validateSecurity: false,
  }),
);

app.use("/products", productsController);
app.use("/orders", ordersController);

app.use((err, req, res, next) => {
  if (err.status !== 400) {
    console.error("ERROR", err);
    return next(err);
  }

  errorResponse(
    res,
    err.status,
    err.name || "Error",
    err.message || "An error occurred",
  );
});

module.exports = app;
