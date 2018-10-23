import web3 from "./web3";
import ContractFactory from "./build/ContractFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(ContractFactory.interface),
  "0xccA91Bf23f408949060e7248a78a780BE6f70E4a"//address of our deployed contract
);

export default instance;