import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Rating } from "@mui/material";
import axios from "axios";

const Product = () => {
  const { category } = useParams();
  const url = import.meta.env.VITE_URL;
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const [productId, setProductId] = useState('')

  const active = location.pathname

  const fetchData = async (page = 1) => {
    try {
      if (category) {
        const response = await axios.post(
          `${url}/users/getproducts?page=${page}&limit=9`, // Pass pagination params
          { category: category },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setData(response.data.data.products);
        setCurrentPage(response.data.data.currentPage);
        setTotalPages(response.data.data.totalPages);
      } else {
        const response = await axios.get(
          `${url}/seller/allproducts?page=${page}&limit=9`, // Pass pagination params
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setData(response.data.data.products);
        setCurrentPage(response.data.data.currentPage);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const AddToCart = async() => {
    try {
        const response = await axios.post(
          `${url}/users/cart/add`, // Pass pagination params
          { productId: productId ,quantity: 1},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response.data.data)
      } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Reset currentPage to 1 when the path changes
    setCurrentPage(1);
    fetchData(1)
  }, [location.pathname]);
  
  useEffect(() => {
    // Fetch data whenever currentPage changes
    fetchData(currentPage);
  }, [currentPage]);


  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div
      style={{ background: "black", height: "100vh" }}
      className="text-white"
    >
      <div style={{ height: "100vh" }} className="flex ml-4">
        <div className="mt-4">
          <Sidebar />
        </div>
        <div style={{ overflowY: "auto" }} className="ml-4 mt-4">
          <div
            style={{
              height: "96vh",
              width: "81vw",
              background:
                "linear-gradient(to bottom, #171518 0%, #1d181d 80%, #251b25 100%)",
              border: "0.5px solid rgba(255, 255, 255, 0.123)",
            }}
            className="rounded-md"
          >
            <div className="m-12 flex flex-col">
              <h1 className="text-3xl font-semibold font-sans">
                List of Trending{" "}
                {category &&
                  category.charAt(0).toUpperCase() +
                    category.slice(1).toLowerCase()}{" "}
                Clothes
              </h1>
              <div className="flex justify-between">
              <div className="flex gap-5 mt-8">
                <Link to={"/dashboard"}>
                  <button
                    style={{ background: "#343434", width: "9vw", height: "6vh" }}
                    className={`rounded-3xl font-sans font-semibold ${active === '/dashboard' ? 'text-gray-100': 'text-gray-400'}`}
                  >
                    Recommended
                  </button>
                </Link>
                <Link to={"/dashboard/men"}>
                  <button
                    style={{ background: "#343434", width: "9vw", height: "6vh" }}
                    className={`rounded-3xl font-sans font-semibold ${active === '/dashboard/men' ? 'text-gray-100': 'text-gray-400'}`}
                  >
                    Men
                  </button>
                </Link>
                <Link to={"/dashboard/women"}>
                  <button
                    style={{ background: "#343434", width: "9vw", height: "6vh" }}
                    className={`rounded-3xl font-sans font-semibold ${active === '/dashboard/women' ? 'text-gray-100': 'text-gray-400'}`}
                  >
                    Women
                  </button>
                </Link>
                <Link to={"/dashboard/kids"}>
                  <button
                    style={{ background: "#343434", width: "9vw", height: "6vh" }}
                    className={`rounded-3xl font-sans font-semibold ${active === '/dashboard/kids' ? 'text-gray-100': 'text-gray-400'}`}
                  >
                    Kids
                  </button>
                </Link>
              </div>
                          {/* Pagination Buttons */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-red-600"
                } text-white mr-4`}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-red-600"
                } text-white`}
              >
                Next
              </button>
            </div>
              </div>
            </div>

            <div style={{height:"65vh", scrollbarWidth: "none", /* For Firefox */
    msOverflowStyle: "none"}} className="m-14 overflow-y-auto grid grid-cols-3 gap-6">
              {data.map((item, index) => (
                <Link key={index} onMouseEnter={()=> setProductId(item._id)} to={`/dashboard/productview/${item._id}`}>
                  <div
                    style={{
                      width: "20vw",
                      height: "50vh",
                      backgroundImage: `url(${item.productImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    className="bg-yellow-200 cursor-pointer mb-5 rounded-3xl"
                  >
                    <div style={{ paddingTop: "32vh" }}>
                      <Rating className="ml-3" name="simple-controlled" value={3} />
                      <div className="ml-3 pb-1 font-sans font-semibold mr-5">
                        <p>
                      {item.name.length > 40
            ? item.name.substring(0, 40) + "..."
            : item.name}</p>
                        <p>
                      {item.description.length > 35
            ? item.description.substring(0, 35) + "..."
            : item.description}
                        </p>
                      </div>
                      <div className="flex justify-around gap-9">
                        <p className="text-2xl font-sans font-semibold">
                          ₹{item.price}
                        </p>
                        <div
                          style={{ height: "5vh", width: "8vw" }}           onClick={(e) => {
                            e.preventDefault() 
                            AddToCart();     
                          }}
                          className="rounded-3xl bg-neutral-400 hover:bg-blue-500 flex items-center justify-center"
                        >
                          <p>Add To Cart</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ right: "8vw" }} className="absolute bottom-8">
              {/* <Searchbar /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
