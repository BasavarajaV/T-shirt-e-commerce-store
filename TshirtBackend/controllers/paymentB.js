const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId:  "km9tzrc2dv4qg796",
  publicKey: "wm3dnrmvrxr4r3q4",
  privateKey: "a97dd3f7453ff39ada8c8d524481608c"
});



exports.getToken = (req, res) =>{
    console.log("token log", req.profile);
    gateway.clientToken.generate({}, (err, response) => {
        if(err){
            res.status(500).send(err)
        }else {
            res.send(response)
        }
      });
}


exports.processPayment = (req, res) =>{

    let nonceFromTheClient = req.body.paymentMethodNonce;

    let amountFromTheClient = req.body.amount

    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
        if(err){
            res.status(500).send(err)
        }else {
            res.send(result)
        }
      });
}