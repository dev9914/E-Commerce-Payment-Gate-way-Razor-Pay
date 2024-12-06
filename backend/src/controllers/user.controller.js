import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.models.js";
import { Order } from "../models/order.models.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Somthing went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password,fullname } = req.body;

  if (username === "") {
    throw new ApiError(400, "username is required");
  }
  if (fullname === "") {
    throw new ApiError(400, "username is required");
  }
  if (email === "") {
    throw new ApiError(400, "email is required");
  } else if (!email.endsWith("@gmail.com")) {
    throw new ApiError(400, "email must be a Gmail address");
  }
  if (password === "") {
    throw new ApiError(400, "password is required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
    fullname
  });

  const { accessToken} = await generateAccessAndRefreshTokens(
    user._id
  );

  const createdUser = await User.findById(user._id).select("-password -__v");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, {createdUser, accessToken}, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  if(user.role == 'seller') {
    throw new ApiError(401,"Only buyer can login from this page")
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password is not Correct");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
        200, 
        {
            user: loggedInUser, accessToken, refreshToken
        },
        "User logged In Successfully"
    )
)


});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
   httpOnly: true,
   secure: true,
 };

 return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "User logged Out Successfully"))



});

const getUserDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id

  const userDetails = await User.findById(userId).select('-password');

  if(!userDetails) {
    throw new ApiError(500, "Somthing went wrong while finding user Details")
  }

  res.status(200).json(new ApiResponse(200,{userDetails},"User found Successfully"))
})

const updateUserDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Extract fields from the request body
  const { username, fullname, role } = req.body;

  // Find the user and update only the provided fields
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { username, fullname, role } }, 
    { new: true, runValidators: true }
  ).select('-password');

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(
    new ApiResponse(200, { userDetails: updatedUser }, "User details updated successfully")
  );
});


const sellerLogin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  if(user.role === "buyer") {
    throw new ApiError(400, "Only sellers are permitted to log in from this page")
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password is not Correct");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInSeller = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
        200, 
        {
            user: loggedInSeller, accessToken, refreshToken
        },
        "Seller logged In Successfully"
    )
)


});

const getProducts = asyncHandler(async (req, res) => {
  const { category } = req.body;
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 items per page

  // Calculate the number of items to skip
  const skip = (page - 1) * limit;

  // Fetch products by category with pagination
  const products = await Product.find({ category })
    .skip(skip)
    .limit(Number(limit));

  // Get the total count of products in the given category
  const totalProducts = await Product.countDocuments({ category });

  res.status(200).json(
    new ApiResponse(200, 
      {
        products,
        currentPage: Number(page),
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
      }, 
      "Products fetched successfully"
    )
  );
});

const getProductbyId = asyncHandler(async (req, res) => {
  const {productId} = req.body

  const getProduct = await Product.findById(productId)

  res.status(200).json(new ApiResponse(200,{getProduct},"Product Found Successfully"))
})

const recentlyView = asyncHandler( async (req, res) => {
      const userId = req.user._id; 
      const productId = req.params.id;

      const user = await User.findById(userId);

      if (!user.recentlyViewed.includes(productId)) {
         user.recentlyViewed.unshift(productId); 
      }

      if (user.recentlyViewed.length > 10) {
         user.recentlyViewed.pop();
      }

      await user.save();

      return res.status(200).json(new ApiResponse(200, {}, "Success: True"))
})

const getrecentViewed = asyncHandler( async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate('recentlyViewed');

  return res.status(200).json(new ApiResponse(200, { recentlyViewed: user.recentlyViewed}))
})

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  // Ensure quantity is greater than 0
  if (quantity <= 0) {
    return res.status(400).json(new ApiResponse(400, null, "Quantity must be greater than 0"));
  }

  // Find the user's cart
  let cart = await Cart.findOne({ user: userId });

  // If the cart doesn't exist, create a new cart
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  // Check if the product already exists in the cart
  const existingProductIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingProductIndex !== -1) {
    // If the product exists, update the quantity
    cart.items[existingProductIndex].quantity += quantity;
  } else {
    // If the product doesn't exist, add it to the cart
    cart.items.push({ product: productId, quantity });
  }

  // Save the cart
  await cart.save();

  res.status(200).json(new ApiResponse(200, cart, "Product added to cart successfully"));
});

const getCartItems = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming the user ID is retrieved from the authenticated request

  // Find the cart for the user
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, { items: [] }, "Cart is empty"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, { items: cart.items }, "Cart fetched successfully"));
});

const deleteCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get the user ID from the authenticated request
  const { productId } = req.params; // Get the product ID from the request body

  // Find the cart for the user
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Cart not found"));
  }

  // Check if the product exists in the cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Product not found in cart"));
  }

  // Remove the product from the cart
  cart.items.splice(itemIndex, 1);

  // Save the updated cart
  await cart.save();

  res
    .status(200)
    .json(new ApiResponse(200, { items: cart.items }, "Product removed from cart successfully"));
});

const calculateCartTotal = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    return res.status(404).json(new ApiResponse(404, null, "Cart not found"));
  }

  let totalPrice = 0;
  let totalQuantity = 0;

  cart.items.forEach((item) => {
    totalPrice += item.product.price * item.quantity;
    totalQuantity += item.quantity;
  });

  res.status(200).json(new ApiResponse(200, { totalPrice, totalQuantity }, "Cart summary"));
});

const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {items, totalPrice, shippingAddress, paymentMethod } = req.body;

  if (!userId || !items || !totalPrice || !shippingAddress || !paymentMethod) {
    res.status(400);
    throw new Error("All fields are required!");
  }

  const orderStatus = paymentMethod === "Cash On Delivery" ? "Success" : "Pending";

  // Create a new order
  const order = new Order({
    userId,
    items,
    totalPrice,
    shippingAddress,
    paymentMethod,
    status: orderStatus, // default status, you can modify based on the flow
  });

  // Save the order to the database
  const createdOrder = await order.save();

  // Prepare the response
  res.status(201).json(
    new ApiResponse(
      201,
      { order: createdOrder },
      "Order created successfully"
    )
  );
});

const getOrderItems = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming the user ID is retrieved from the authenticated request

  // Find all orders for the user
  const orders = await Order.find({ userId }).populate("items.productId") .sort({ createdAt: -1 });

  if (!orders || orders.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, { items: [] }, "No orders found"));
  }

  // Prepare the items list from the orders
  const items = orders.flatMap(order => order);

  res
    .status(200)
    .json(new ApiResponse(200, { items }, "Orders fetched successfully"));
});

export { registerUser, loginUser, logoutUser , sellerLogin, getUserDetails, getProducts,getProductbyId,recentlyView,getrecentViewed, addToCart, getCartItems, deleteCartItem, calculateCartTotal,createOrder, getOrderItems, updateUserDetails};
