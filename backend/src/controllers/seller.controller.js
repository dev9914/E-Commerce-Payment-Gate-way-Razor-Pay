import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const becomeSeller = asyncHandler( async (req, res) => {

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          role: 'seller',
        },
      },
      {
        new: true,
      }
    );
  
    if(!user) {
      throw new ApiError(500, "user not found")
    }
  
    res.status(201).json( new ApiResponse(200, {user: user},"You are now a seller"));
  
  })

const addProduct = asyncHandler( async (req, res) => {

    if (req.user.role !== 'seller') {
        throw new ApiError(400, "Access denied. Only sellers can add products.")
  }

  const { name, price, description ,category} = req.body

  if (!name) {
    throw new ApiError(400, 'Name is required.')
  }
  if (!price) {
    throw new ApiError(400, 'Price is required.')
  }
  if (!category) {
    throw new ApiError(400, 'Category is required.')
  }

  const ProdcutImageLocalPath = req.files?.productImage[0]?.path

  if (!ProdcutImageLocalPath) {
    throw new ApiError(400, "Product Image file is required")
   }

  const productImagecloud = await uploadOnCloudinary(ProdcutImageLocalPath)

   if (!productImagecloud) {
    throw new ApiError(400, "Some error occured while uploading the product image")
   }

    const product = await Product.create({
      name,
      price,
      productImage: productImagecloud?.url,
      description,
      seller: req.user._id,
      category
    })

    const createProduct = await Product.findById(product._id)

    if(!createProduct) {
        throw new ApiError (500, "Something went wrong while creating the product")
    }

    res.status(200).json(new ApiResponse(200, {createProduct},"Product created Successfully"))


})

const getOwnProducts = asyncHandler(async (req, res) => {
  if (req.user.role !== 'seller') {
    throw new ApiError(400, "Access denied. Only sellers can access this route.");
  }

  // Extract pagination parameters from the query, with defaults
  const { page = 1, limit = 10 } = req.query;

  // Calculate the number of items to skip
  const skip = (page - 1) * limit;

  // Fetch products with pagination
  const ownProducts = await Product.find({ seller: req.user._id })
    .skip(skip)
    .limit(Number(limit));

  // Get the total count of products for the seller
  const totalProducts = await Product.countDocuments({ seller: req.user._id });

  res.status(200).json(
    new ApiResponse(200, 
      {
        ownProducts, 
        currentPage: Number(page), 
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts
      }, 
      "All products uploaded by you"
    )
  );
});

const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 items per page

  // Calculate the number of items to skip
  const skip = (page - 1) * limit;

  // Fetch products with pagination
  const products = await Product.find()
    .skip(skip)
    .limit(Number(limit)); // Convert limit to a number

  // Get the total count of products
  const totalProducts = await Product.countDocuments();

  // Prepare the response
  res.status(200).json(
    new ApiResponse(200, 
      {
        products, 
        currentPage: Number(page), 
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts
      }, 
      "Products fetched successfully"
    )
  );
});

const searchProducts = asyncHandler(async (req, res) => {
  const { query } = req.query; // Get the search query from request URL
  
  if (!query) {
      return res.status(400).json(new ApiResponse(400, null, "Query parameter is required."));
  }

  try {
      // Search for products that match the query (you can add more fields to search like name, description, etc.)
      const products = await Product.find({
          name: { $regex: query, $options: 'i' } // Case-insensitive search
      });

      // If no products are found
      if (products.length === 0) {
          return res.status(404).json(new ApiResponse(404, null, "No products found."));
      }

      // Send the found products using ApiResponse format
      res.status(200).json(new ApiResponse(200, products, "Products found successfully."));
  } catch (error) {
      res.status(500).json(new ApiResponse(500, null, `Error while searching products: ${error.message}`));
  }
});

export {becomeSeller, addProduct, getOwnProducts, getAllProducts, searchProducts}

