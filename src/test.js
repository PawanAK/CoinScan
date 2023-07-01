const { ethers } = require("ethers");
const w3pay = require("./w3pay/w3pay.json");

const provider = new ethers.providers.JsonRpcProvider("");

// Contracts
const w3payContract = new ethers.Contract(
  "0x6170b96101557cc11F076AA3907f7FF87Db54EE7",
  w3pay.output.abi,
  provider
);

async function getData() {
  const get = await w3payContract.filters.recipeints();
  const trans = await w3payContract.queryFilter(get);
  console.log(trans);
}

getData();
