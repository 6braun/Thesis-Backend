const {ethers} = require('ethers')
const fs = require('fs');

const abi = require('./abis/AdvertContract.json');


const mnemonic = '0xdaa62747cf7bd46238ac388bca529ae8d85b2dbcf32ad4bcdb7f6477e991f60d';


const provider = new ethers.providers.InfuraProvider(
    'ropsten', // or 'ropsten', 'rinkeby', 'kovan', 'goerli'
    '53163527cab64342a9cd4aef0c0440b7'
)

const signer = new ethers.Wallet(mnemonic, provider)


ABI = [
    'function receiveEther() payable public',
    'function getBalance() public view returns (uint)',
    'function withdrawEtherTo(address payable _to) public',
    'function receiveNewAd(uint _id, uint _wei) payable public',
    'function getFunds(uint _id) public view returns(uint)'];


const contract = new ethers.Contract(abi.networks['3'].address, ABI, provider)
const signedContract = contract.connect(signer);

// contract.getBalance().then(res => console.log(parseInt(res, 16)));

function sendMoney() {

    const dai = ethers.utils.parseEther('0.1');

    // Fix von ricmoo @ Github
    const overrides = {
        value: dai
    };
    signedContract.receiveEther(overrides).then(res => console.log(res));
}

function newAd(body) {
    return signedContract.receiveNewAd(body.id, body.funds);
}

function getFunds(_id) {
    signedContract.getFunds(_id).then(res => console.log(res));
}

function getBalance() {
    contract.getBalance().then(res => console.log(parseInt(res, 16)));
}

function getIndex() {
    var files = fs.readdirSync('./uploads/');
    let index;
    files = files.map(el => {
        return parseInt(el.substring(el.indexOf('_') + 1, el.length))
            ;
    });
    index = files.reduce((a, b) => Math.max(a, b));
    return index;
}

function getSigner() {
    return signer;
}

module.exports = {getIndex, getSigner, sendMoney, getBalance, newAd};


