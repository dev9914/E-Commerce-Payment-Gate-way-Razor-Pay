import { Router } from "express";
import { loginUser, registerUser, logoutUser, sellerLogin, getUserDetails, getProducts, getProductbyId, recentlyView, getrecentViewed, addToCart, getCartItems, deleteCartItem, calculateCartTotal, createOrder, getOrderItems, updateUserDetails } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

router.route("/sellerlogin").post(sellerLogin)


//secured routes
router.route('/getproductbyid').post(verifyJWT,getProductbyId)
router.route("/products/:id/view").post(verifyJWT,recentlyView)
router.route("/product/getrecentviewed").get(verifyJWT,getrecentViewed)
router.route("/logout").post(verifyJWT, logoutUser)
router.route('/getuserdetails').get(verifyJWT, getUserDetails)
router.route('/getproducts').post(verifyJWT, getProducts)
router.route('/cart/add').post(verifyJWT, addToCart)
router.route('/cart/getItem').get(verifyJWT, getCartItems)
router.route('/cart/delete/:productId').delete(verifyJWT, deleteCartItem)
router.route('/cart/Total').get(verifyJWT, calculateCartTotal)
router.route('/order/create').post(verifyJWT, createOrder)
router.route('/order/getorder').get(verifyJWT, getOrderItems)
router.route('/profile/update').patch(verifyJWT, updateUserDetails)

export default router