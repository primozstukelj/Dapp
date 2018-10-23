import Web3 from 'web3';

let web3;


if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined'){
    // We are in the browser and Meta mask is running
    web3 = new Web3(window.web3.currentProvider);

}else{
    // We are on the server or the user is't running metamask
    // So this is how we make our own provider.
    const provider = new Web3.providers.HttpProvider(
        "https://rinkeby.infura.io/v3/cba74fcda6c8469290fc4671d2436d91"
      );

      //making own instance of web3
      web3 = new Web3(provider);
}

export default web3;