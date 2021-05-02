const HDWalletProvider = require("@truffle/hdwallet-provider");
const { ethers } = require('ethers')

const abi = require('./abis/AdvertContract.json');

console.log(abi);


const mnemonic = '0xdaa62747cf7bd46238ac388bca529ae8d85b2dbcf32ad4bcdb7f6477e991f60d';


const provider = new ethers.providers.InfuraProvider(
    'ropsten', // or 'ropsten', 'rinkeby', 'kovan', 'goerli'
    '53163527cab64342a9cd4aef0c0440b7'
)

const signer = new ethers.Wallet(mnemonic, provider)


const ABI = ['function receiveEther() payable public',
    'function getBalance() public view returns (uint)',
    'function withdrawEtherTo(address payable _to) public'];


const contract = new ethers.Contract(abi.networks['3'].address, ABI, provider)
const signedContract = contract.connect(signer);

contract.getBalance().then(res => console.log(parseInt(res, 16)));

function sendMoney() {

    // Fix von ricmoo @ Github
    const dai = ethers.utils.parseEther('0.1');
    const overrides = {
        value: dai
    };
    signedContract.receiveEther(overrides).then(res => console.log(res));
}



// sendMoney();
