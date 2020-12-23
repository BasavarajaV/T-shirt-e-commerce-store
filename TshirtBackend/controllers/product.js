const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")


exports.getProductByID=(req, res, next, id)=>{
    Product.findById(id)
    //.populate("category")  there is bug here while deleteing
    .exec((err, product)=>{ 
        if(err){
            return res.status(400).json({
                error: "Product not found"
            })
        }

        req.product = product;
        console.log("i am into param");
        next(); // fixed this bug
    })
}

exports.createProduct= (req, res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    

    form.parse(req, (err, fields, file)=>{
        if(err){
            return res.status(400).json({
                error: "Problem with image"
            })
        }
        
        //destructure the fields
        const { name, description, price, category, stock} = fields;

        if(
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ){
            return res.status(400).json({
                error: "Please include all fields"
            })
        }
        // TO DO is completed for restrcition on fields
        let product = new Product(fields)

        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size too big!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        // console.log(product)

        //save to the DB
        product.save((err, product)=>{
            if(err){
                return res.status(400).json({
                    error: " Saving tshirt in DB failed"
                })
            }
            res.json(product)
        })
    })
} 

exports.getProduct = (req, res)=>{
    req.product.photo= undefined
    return res.json(req.product)
}

// middleware
// exports.photo =(req, res, next)=>{
//     if(req.product.photo.data){
//         console.log("i am here5");
//         req.set("Content-Type", req.product.photo.contentType); //there is a bug
//         return res.send(req.product.photo.data)
//     }
//     next();
// }

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
      res.set("Content-Type", req.product.photo.contentType);
      return res.send(req.product.photo.data);
    }
    next();
  };

//delete controllers
// exports.deleteProduct = (req, res)=>{
//     let product= req.product;
//     console.log(product);
//     product.remove((err, deletedProduct)=>{
//         if(err){
//             return res.status(400).json({
//                 error:" Failed to delete the product"
//             })
//         }
//         res.json({
//             message:" Deletion was a success",deletedProduct
//         })
//     })
// }

exports.deleteProduct = (req, res) => {
    console.log(req.product);
    let product = req.product;
    
    product.remove((err, deletedProduct) => {
      if (err) {
        return res.status(400).json({
          error: "Failed to delete the product"
        });
      }
      res.json({
        message: "Deletion was a success",
        deletedProduct
      });
    });
  };


//update controller
exports.updateProduct = (req, res)=>{

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file)=>{
        if(err){
            return res.status(400).json({
                error: "Problem with image"
            })
        }

        //updation code
        let product = req.product;
        product= _.extend(product, fields); // lodash 

        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size too big!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }


        //save to the DB
        product.save((err, product)=>{
            if(err){
                return res.status(400).json({
                    error: " Updation of product failed"
                })
            }
            res.json(product)
        })
    })
} 

//product listing
// exports.getAllProducts = (req, res) => {
//     let limit = req.query.limit ? parseInt(req.query.limit) : 8;
//     let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  
//     Product.find()
//       .select("-photo")
//       .populate("category")
//       .sort([[sortBy, "asc"]])
//       .limit(limit)
//       .exec((err, products) => {
//         if (err) {
//           return res.status(400).json({
//             error: "NO product FOUND"
//           });
//         }
//         res.json(products);
//       });
//   };

exports.getAllProducts = (req,res)=>{
    Product.find()
    .select("-photo")
    .exec((err, products)=>{
        if(err){
            return res.status(400).json({
                error: "No categories found"
            })
        }
        res.json(products)
    })
}
  



exports.getAllUniqueCategories = (req,res)=>{
    Product.distinct("category", {}, (err,category)=>{
        if(err){
            return res.status(400).json({
                error: "No category found"
            })
        }
        res.json(category)
    })
}


exports.updateStock = (req, res, next)=>{
    let myOperations = req.body.order.products.map(prod=>{
        return {
            updateOne: {
                filter: {_id: prod._id},
                update: {$inc: {stock: -prod.count, sold: +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOperations, {} , (err, products)=>{
        if(err){
            return res.status(400).json({
                error: "Bulk operations failed"
            })
        }
        next();
    })
}


