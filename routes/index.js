var express = require('express');
var router = express.Router();
const qr = require('qrcode');
const validUrl = require('valid-url');
const shortid = require('shortid');

const Url = require('../models/UrlModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ໜ້າຫຼັກ' });
  // res.render('index', { title: 'QRcode and Shorten URL' });
});

router.get('/qrcode&shortenUrl', function(req, res, next) {
  // res.render('index', { title: 'ໜ້າຫຼັກ' });
  res.render('qrcodeshorturl', { title: 'QRcode and Shorten URL' });
});

// const baseUrl = 'http:localhost:3000';
router.post('/generateqrcode', function(req, res, next){
  const longUrl = req.body.txtqrcode;

  // if(!validUrl.isUri(baseUrl)){
  //   // return res.status(401).json('ລິ້ງຂອງເວັບບໍ່ຖືກ');
  //   return res.render('error', {message: "ລິ້ງຂອງເວັບບໍ່ຖືກ", error: {status: "401", stack: "test error 01"}});
  // }

  // const urlCode = shortid.generate();

  // if(validUrl.isUri(longUrl)){
  //   try{
  //     let url = await Url.findOne({longUrl})
  //     if(url){
  //         res.redirect(url)
  //     }else{
  //       const shortUrl = baseUrl + '/' + urlCode;
  
  //       let url = new Url({longUrl, shortUrl, urlCode, data: new Date()});
  //       await url.save();
  
        if(longUrl.length === 0) res.send("Empty Data!")
        qr.toDataURL(longUrl, (err, src) => {
          if(err) res.send("ມີຂໍ້ມູນບາງຢ່າງຜິດພາດ");
              
          // res.render("resultgen", {shortUrl, urlCode, src, title: "ໜ້າສະແດງ QRcode"});
          res.render("resultgen", {longUrl, src, title: "ໜ້າສະແດງ QRcode"});
        });

  //     }
  //   }catch(err){
  //     // res.status(500).json('Server Error');
  //     return res.render('error', {message: "Server Error", error: {status: "500", stack: "test error 02"}});
  //   }
  // }else{
  //   console.log(longUrl);
  //   return res.render('error', {message: "Invalid longUrl", error: {status: "401", stack: "test error 03"}});
  //   // res.status(401).json('Invalid longUrl');
  // }
});

router.get('/:code', async function(req, res, next) {
  try {
    const url = await Url.findOne({urlCode: req.params.code});

    if(url){
      return res.redirect(url.longUrl)
    }else{
      return res.render('error', {message: "No URL Found", error: {status: "404", stack: "test error 04"}});
    }
  } catch (err) {
    return res.render('error', {message: "Server Error", error: {status: "500", stack: "test error 05"}});
  }
});

module.exports = router;
