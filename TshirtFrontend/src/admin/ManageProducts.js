import React, { useState, useEffect } from "react";

import Base from "../core/Base";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { getProducts, deleteProduct } from "./helper/adminapicall";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);


  const { user, token } = isAuthenticated();

  // const [values, setValues] = useState({

  //   products: []
    
  // })

  // const {products} = values;

  const preload = () => {
    getProducts().then(data => {
      if (data && data.error) {
        console.log(data.error);
        console.log("iam here1");
      } else {
        setProducts(data);
        
        console.log(data);
        
      }
    });
  };

//   const preload= () =>{
//     getProducts().then(data =>{
//         console.log(data);
        
//         if(data.error){
//             setValues({...values, error: data.error})
//         } else {
//           console.log("i m here");
//             setValues({...values, products: data }) 
//             console.log("Products",products);
//         }
//     })
// }


  useEffect(() => {
    preload();
  }, []);

  const deleteThisProduct = productId => {
    console.log(productId)
    console.log(user._id)
    deleteProduct(productId, user._id, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log("iam here")
        preload();
      }
    });
  };

  return (
    <Base title="Welcome admin" description="Manage products here">
      <h2 className="mb-4">All products:</h2>
      <Link className="btn btn-info" to={`/admin/dashboard`}>
        <span className="">Admin Home</span>
      </Link>
      <div className="row">
        <div className="col-12">
          <h2 className="text-center text-white my-3">Total 3 products</h2>

          {products.map((product, index) => {
            return (
              <div key={index} className="row text-center mb-2 ">
                <div className="col-4">
                  <h3 className="text-white text-left">{product.name}</h3>
                </div>
                <div className="col-4">
                  <Link
                    className="btn btn-success"
                    to={`/admin/product/update/${product._id}`}
                  >
                    <span className="">Update</span>
                  </Link>
                </div>
                <div className="col-4">
                  <button
                    onClick={() => {
                      deleteThisProduct(product._id);
                    }}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Base>
  );
};

export default ManageProducts;
