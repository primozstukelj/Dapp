const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');//file-system module


const buildPath = path.resolve(__dirname, 'build');//path from working directory ethereum ot the build directory
fs.removeSync(buildPath);//looks the folder build and delete all file insade and folder itself

const campaingPath = path.resolve(__dirname, 'contract','Contract.sol');
const source = fs.readFileSync(campaingPath, 'utf8');//it read the code and save it to the source

const output  = solc.compile(source,1).contracts;//it contains two objects two contracts

fs.ensureDirSync(buildPath);//checks if dir exist if not, the function create us build folder
//console.log(output);
for( let contract in output){
    //1.iteracia contract = ':Campaign'
    //fs.outputJsonSync('kickstarter/ethereum/build/contract.json, read the file and write it in this newly created file)
    fs.outputJsonSync(
        path.resolve(buildPath,`${contract.replace(':','')}.json`),
        output[contract]
    );
}