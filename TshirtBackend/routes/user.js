const express = require("express")

const User=require("../models/user")

const {getUserByID, getUser, updateUser, userPurchaseList } = require("../controllers/user")
const { isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth")
const router = require("./auth")

router.param("userId",getUserByID);

router.get("/user/:userId", isSignedIn , isAuthenticated , getUser);

//small assignmnet
//router.get("/users", getAllUsers);

router.put("/user/:userId", isSignedIn , isAuthenticated , updateUser );

router.get("/orders/user/:userId", isSignedIn , isAuthenticated , userPurchaseList );




module.exports = router;

