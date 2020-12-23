const express = require("express");
const router =  express.Router();

const {getCategoryByID, createCategory,getCategory, getAllCategory, updateCategory, removeCategory} = require("../controllers/category")
const {isSignedIn, isAdmin, isAuthenticated} = require("../controllers/auth")
const {getUserByID} = require("../controllers/user")

//params
router.param("userId",getUserByID);
router.param("categoryId",getCategoryByID);

//actual routes goes here

//create
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin,  createCategory)

//read
router.get("/category/:categoryId", getCategory)
router.get("/categories", getAllCategory)

//update
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory)

//delete
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin,  removeCategory)


module.exports = router;