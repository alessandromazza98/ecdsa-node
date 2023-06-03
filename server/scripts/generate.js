const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const { toHex, hexToBytes } = require('ethereum-cryptography/utils');
const { keccak256 } = require("ethereum-cryptography/keccak");

const private_key = secp256k1.utils.randomPrivateKey();
const public_key = secp256k1.getPublicKey(private_key);
const address = keccak256(public_key.slice(1)).slice(-20);

console.log("private key:", toHex(private_key));
console.log("public key:", toHex(public_key));
console.log("address:", toHex(address));