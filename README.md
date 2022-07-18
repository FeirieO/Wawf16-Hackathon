# WWAF Coin  
   This is a new blockchain
# BlockChain Folder
    This contains the crypto.js that holds the functions for building WWAF coin. it has the following functionalities:
    - Transaction Class  
       This class contains the constructor, signtransaction and is valid function. it allows for adding transaction to the blockchain using the amount, senderpublickey(publickey of the sender) and receiverPublickey(public key of the receiver). The transaction is signed using the senders private key and the isValid function is used to verify the transaction signature.  
    - Wallet Class  
       This class allows users to create a new wallet and returns the user's private and public keys
    - CryptoBlock
    - CryptoChain
    - 
    
# How to run the project

1. Clone the project
2. cd to the blockchain directory and cd ..
3. Run 'npm start'
4. Go to browser, run localhost:3000
5. Click 'Connect" to generate the public and private key
6. The "wallet address of the receiver" could be "12ehuwrvdieifbowfwnkwnd6yi"


# Tools, Languages and Frameworks used
Javascript (The entire project is developed in Javascript(NodeJs framework)

PUB.js (Used to develop the frontend part)
