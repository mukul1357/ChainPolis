import Authentication from './artifacts/contracts/Authentication.sol/Authentication.json';
require("dotenv").config();

const Contract = async (web3) => {
    const NEXT_PUBLIC_ADDRESS = process.env.REACT_APP_NEXT_PUBLIC_ADDRESS

    return new web3.eth.Contract(
        Authentication.abi,
        NEXT_PUBLIC_ADDRESS,
        web3
    );
}

export default Contract;