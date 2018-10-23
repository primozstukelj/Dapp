const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/ContractFactory.json");

const provider = new HDWalletProvider( //arg: menemonic, infura link of endpoint
  "core domain ice broom master shadow success thumb little rotate wisdom creek",
  "https://rinkeby.infura.io/v3/cba74fcda6c8469290fc4671d2436d91"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log(
    `List of all avaliable accounts: ${accounts}. Single account: ${
      accounts[0]
    }`
  );
  try {
      //create contract, result is instance of our contract
        const result = await new web3.eth.Contract(
          JSON.parse(compiledFactory.interface)
        )
          .deploy({ data: "0x" + compiledFactory.bytecode /*, gas: '2000000'*/ })
          .send({ from: accounts[0], gas: "2000000" });
        console.log(`Contract deployed to: ${result.options.address}`);
      
  } catch (error) {
      console.log(error.message);
  }
};
deploy();
