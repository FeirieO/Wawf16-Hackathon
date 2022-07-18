var express = require('express');
var router = express.Router();
//var blockchain = require('../blockchain/crypto.js')
const {Transaction, Wawf16Coin, Wallet, cBlock, CryptoBlockchain} = require('../blockchain/crypto.js')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const minerWallet = "04cc303bb93e7dcf8e36ab883a55e012650318d68ed0b1c6129ee888bb3da371fa30e412f5edd530596fef80b8ab7b9d89f43dae89c4adc75c3d4d0ccb204385a6";
var songs = require('../blockchain/music.json');
/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.cookies.wwafPublicKey){
    res.render('index', { msg: 'user' });
  }else{
    res.render('index');
  } 
  //res.render('index');
  
});

router.get('/airdrop', function(req, res, next) {
  if(req.cookies.wwafPublicKey){
    res.render('airdrop', { msg: 'user' });
  }else{
    res.render('airdrop');
  } 
  //res.render('index');
  
});

router.post('/drop', function(req, res, next) {
  if(req.cookies.wwafPublicKey){
    const pbKey = (req.cookies.wwafPublicKey).toString();
    const coins = parseInt(req.body.coins);
    //console.log("coins", coins)
    const walletDonor = "04cc303bb93e7dcf8e36ab883a55e012650318d68ed0b1c6129ee888bb3da371fa30e412f5edd530596fef80b8ab7b9d89f43dae89c4adc75c3d4d0ccb204385a6";
    const key = ec.keyFromPrivate("ce05f884b323a2d0e84084e1789848479efcd0136d39c0e7c1354acc0c1559d0")
    const txn = new Transaction(coins, walletDonor, pbKey);
    //console.log("s", senderPrivate )
    txn.signTransaction(key);
    console.log(txn.isValid()) //TODO: come back and fix this later
    Wawf16Coin.addTransaction(txn);
    Wawf16Coin.addNewBlock(minerWallet);
    console.log(Wawf16Coin);
    res.send('airdrop successfull');
  }else{
    res.send('no user');
  } 
  //res.render('index');
  
});

router.get('/transaction', function(req, res, next) {
  if(req.cookies.wwafPublicKey){
    //const cb = new Wawf16Coin
    const balance = Wawf16Coin.getBalanceOfAddress(req.cookies.wwafPublicKey)
    res.render('transaction', { msg: "user", key: req.cookies.wwafPublicKey, balance: balance });
  }else{
    res.render('transaction');
  } 
  //res.render('index');
});

router.post('/sendCoin', function(req, res, next) {
  //console.log(req.body.publicKey);
  const senderPrivate = req.body.senderPrivateKey;
  const receiverPublic = (req.body.receiverPublicKey).toString();
  const amount = parseInt(req.body.amount);
  const key = ec.keyFromPrivate(senderPrivate.toString())
  const myWalletAddress = key.getPublic('hex')
  const txn = new Transaction(amount, myWalletAddress, receiverPublic);
  //console.log("s", senderPrivate )
  txn.signTransaction(key);
  //console.log(txn.isValid()) //TODO: come back and fix this later
  Wawf16Coin.addTransaction(txn);
  Wawf16Coin.addNewBlock(minerWallet);
  console.log(Wawf16Coin);
  res.send("Transaction added successfully")
});

router.get('/stream', function(req, res, next) {
  if(req.cookies.wwafPublicKey){
    //const cb = smashingCoin;
    const balance = Wawf16Coin.getBalanceOfAddress(req.cookies.wwafPublicKey)
    if (songs.length == 0){
      res.render('stream')
    }else{
      res.render('stream', {songs: songs, balance: balance})
    }
  }else{
    res.render('stream');
  } 
  
});

router.post('/stream', function(req, res, next) {
  
  const cost = parseInt(req.body.cost);
  const mLink = req.body.musicLink;
  const mPublicKey = (req.body.mPublickey).toString();
  const privateKey = (req.body.privateKey).toString();
  //console.log(privateKey);

  if(req.session.cookie != undefined){
    //const cb = smashingCoin
    const balance = Wawf16Coin.getBalanceOfAddress(req.cookies.wawf16coinPublicKey)
    //const balance = 3;
    if (balance <= 0 || balance < cost){
      console.log("Insufficient funds");
      res.send('Insufficient WAWF coin')
    }else{
      //TODO Process Payment for stream
      const senderPrivate = privateKey;// public key: "0418f68bba71b2dde142377e25a0c4473914f4fe0236a2f7ca76303cc104e70a442d5a23899e1508b4a1da3ce76d267d6953fa0ae62ecf28aa0a6f083a30ec6d09"
      const receiverPublic = mPublicKey;
      const amount = cost;
      const key = ec.keyFromPrivate(senderPrivate)
      const myWalletAddress = key.getPublic('hex')
      const txn = new Transaction(cost, myWalletAddress, receiverPublic);
      txn.signTransaction(key);
      console.log(txn.isValid()) //TODO: come back and fix this later
      Wawf16Coin.addTransaction(txn);
      Wawf16Coin.addNewBlock(minerWallet);
      console.log(Wawf16Coin);
      console.log("redirecting..")
      res.send({redirect: `${mLink}`});
      //res.send(mLink)
    }
  }else{
    res.render('stream');
  } 

});

/* GET home page. */
router.get('/create', function(req, res, next) {
  //console.log(blockchain);
  const wallet = new Wallet();
  //console.log(wallet)
  res.json(wallet.walletLog())
});

router.post('/connect', function(req, res, next) {
  //console.log(req.body.publicKey);
  var cookie = req.cookies.wawf16coinPublicKey;
  if (cookie === undefined) {
    // no: set a new cookie
    var wawf16coinPublicKey=req.body.publicKey;
    res.cookie('wwafPublicKey',wawf16coinPublicKey, { maxAge: 900000, httpOnly: true });
    //console.log('cookie created successfully');
  } else {
    // yes, cookie was already present 
    //res.redirect('/')
    //console.log('cookie exists', cookie);
    
  } 
  next(); // <-- important!
});

module.exports = router;
