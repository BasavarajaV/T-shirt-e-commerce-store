const express = require("express");
const router =  express.Router();

const {getProductByID, createProduct, getProduct, photo, deleteProduct, 
    updateProduct,getAllProducts,getAllUniqueCategories} = require("../controllers/product")
const {isSignedIn, isAuthenticated , isAdmin} = require("../controllers/auth")
const {getUserByID} = require("../controllers/user")


//all of params
router.param("userId",getUserByID);

router.param("productId",getProductByID);

//all of actual routes
//create route
router.post("/product/create/:userId", isSignedIn,isAuthenticated, isAdmin, createProduct);

// read routes
router.get("/product/:productId", getProduct);

router.get("/product/photo/:productId", photo);

//delete routes
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct);

//update routes
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct);

//listing routes
router.get("/allProducts", getAllProducts)

router.get("/products/categories", getAllUniqueCategories)


module.exports = router;
