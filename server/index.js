const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const { toHex, hexToBytes } = require('ethereum-cryptography/utils');
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "d98556c5b68d6546f39d7d73bde563ecb08ef645": 100,
  "5c0fea7b6e53d0fb31fb1db9ac69b71db1a07a22": 50,
  "2512386a0609de368ad911fd871ad7ff41ad13dc": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, publicKey, msgHash, recipient, amount } = req.body;

  // verify signature
  if (!secp256k1.verify(signature, msgHash, publicKey)) {
    res.status(400).send({ message: "Invalid signature. Insert a valid private key"});
  }

  // compute address
  const sender = toHex(keccak256(hexToBytes(publicKey).slice(1)).slice(-20));

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
