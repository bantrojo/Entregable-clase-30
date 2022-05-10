
const express = require('express');
const router = express.Router();
const productManager = require('../Manager/productManager');
const {adminAuth}=require('../middlewares/adminAuth')
const productService = new productManager();
let products = [];

///Router actions

router.get('/products', (req, res) => {
return productService.get(products).then((result) => res.send(result));
})



router.post('/products', [adminAuth], (req, res) => {
    let product = req.body;
    productService.add(product).then((result) => console.log(result));
    //console.log(product);
    // res.redirect("/");
    res.send({ message: "Product created" });
})





router.delete('/products/:num',[adminAuth], (req, res) => {
    if (admin == true) {
        try {
            let param = req.params.num;
            let id = parseInt(param);
            products.splice(id - 1, 1);
            res.json({ products })
        } catch (error) {
            return { status: "error", error: error }
        }
    }
})

//export
module.exports = router;