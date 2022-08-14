import { useEffect, useState, useContext } from "react";
import Web3 from "web3";
import abi from "../constants/abi.json";
import ConnectContext from "./ConnectContext";

const rpc = "https://matic-mumbai.chainstacklabs.com";
const fivePolygonsAddress = "0x0b648FA8d1641e41518fd48d96a6c7d2fdD4F78F";

const useContract = () => {
  const { address, wallet } = useContext(ConnectContext);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const monstaRollContract = getContract(true);
    setContract(monstaRollContract);
  }, [wallet]);

  const getContract = (update = false) => {
      if (contract && !update) return contract;
      const web3 = wallet || new Web3(rpc);
      const monstaRollContract = new web3.eth.Contract(abi, fivePolygonsAddress);
      return monstaRollContract;
  };

  //options= { functionName: string, arguments: array, getPromise: boolean}
  const callContract = async (options) => {
    const contract = getContract();
    if (!contract) return [{ error: "no contract" }, null];
    if (!options.functionName) return [{ error: "no function defined" }, null];

    const args = options.arguments || [];

    const call = contract.methods[options.functionName](...args).call();

    if (options.getPromise) return call;

    try {
      const result = await call;
      return [null, result];
    } catch (err) {
      return [err, null];
    }
  };

  //options = {value, arguments, functionName}
  const sendContract = async (options) => {
    const contract = new wallet.eth.Contract(abi, fivePolygonsAddress);
    if (!contract) return [{ error: "no contract" }, null];

    const txOptions = { from: address, gasPrice: '200000000000' };

    if (!options.valueInWei && options.value) {
      txOptions.value = wallet.utils.toWei(options.value.toString());
    }

    let err = null;
    const args = options.arguments || [];

    const tx = await contract.methods[options.functionName](...args)
      .send(txOptions)
      .catch((error) => {
        err = error;
        console.log(error.message);
        return { status: false, message: error.message, txlink: "" };
      });

    if (err == null)
      return {
        status: true,
        message: "success",
        txlink: getTxLink(tx.transactionHash),
      };
    else return { status: false, message: err.message, txlink: "" };
  };

  const getTxLink = (hash) => {
    return hash;
    //return scanlinks[network]+'tx/'+hash;
  };

  const bet = async (numBet, amount) => {
    if (!contract) return null;
    const result = await sendContract({
      functionName: "play",
      arguments: [numBet],
      value: amount,
    });
    return result;
  };

  const mint = async (rounds) => {
    if (!contract || rounds.length === 0) return;
    const result = await sendContract({
      functionName: "mintBet",
      arguments: [rounds],
    });
    return result;
  };

  const getUserBets = async () => {
    if (!address) return;
    const [err, result] = await callContract({
      functionName: "getUserBets",
      arguments: [address, 0, 100],
    });
    return result;
  };

  const getBet = async () => {
    if (!address) return;
    const [err, result] = await callContract({
      functionName: "userBets",
      arguments: [address, 0],
    });
    return result;
  };

  const claimBet = async (rounds) => {
    if (!contract || rounds.length === 0) return;
    const result = await sendContract({
      functionName: "claimBet",
      arguments: [rounds],
    });
    return result;
  };

  const getNFTBalance = async (id) => {
    if (!address) return;
    const [err, result] = await callContract({
      functionName: "balanceOf",
      arguments: [address, id],
    });
    return result;
  };

  const getCurrentRaffleRoundNo = async () => {
    const [, roundNo] = await callContract({
      functionName: "currentRaffleRound",
    });
    return roundNo;
  };

  const getRaffleRoundData = async (roundNo) => {
    const [, roundData] = await callContract({
      functionName: "raffleRounds",
      arguments: [roundNo],
    });
    return roundData;
  };

  const getCurrentRaffleBalance = async () => {
    const roundNo = await getCurrentRaffleRoundNo();
    const roundData = await getRaffleRoundData(roundNo);
    const web3 = wallet || new Web3(rpc);
    return web3.utils.fromWei(roundData.balance);
  };

  const getUserRaffleTickets = async (roundNo) => {
    if (!address) return 0;
    const [, tickets] = await callContract({
      functionName: "userRaffleTickets",
      arguments: [address, roundNo],
    });
    return tickets || 0;
  };

  const getTotalRaffleTickets = async () => {
    const [, tickets] = await callContract({
      functionName: "getTotalRaffleTickets",
    });
    return tickets || 0;
  };

  const getRaffleResult = async (roundNo) => {
    const [, roundData] = await callContract({
      functionName: "raffleRounds",
      arguments: [roundNo],
    });

    const raffleDuration = 600;

    const web3 = wallet || new Web3(rpc);
    roundData.balance = web3.utils.fromWei(roundData.balance);
    roundData.timeLeft =
      parseInt(roundData.startTimestamp) +
      raffleDuration -
      Math.ceil(Date.now() / 1000);

    return roundData;
  };

  const executeRaffleRound = async () => {
    if (!contract) return;
    const result = await sendContract({
      functionName: "executeRaffleRound",
    });
    return result;
  };

  const cancelSale = async (saleId) => {
    if (!contract) return;
    const result = await sendContract({
      functionName: "cancelSale",
      arguments: [saleId],
    });
    return result;
  };

  const putNFTOnSale = async (tokenId, price) => {
    if (!contract) return;
    const priceWei = Web3.utils.toWei(price.toString());
    const result = await sendContract({
      functionName: "putOnSale",
      arguments: [tokenId, priceWei],
    });
    return result;
  };

  const checkIfNFTOnSale = async (token_id) => {
    const [, isOnSale] = await callContract({
      functionName: "isTokenOnSale",
      arguments: [address, token_id],
    });
    return isOnSale;
  };

  const checkIfClaimableNFTRaffle = async () => {
    if(!address) return false;
    const [, isClaimable] = await callContract({
      functionName: "claimableNFTRaffle",
      arguments: [address],
    });
    return isClaimable;
  }

  const buyNFT = async (saleId, price) => {
    if (!contract) return;
    const result = await contract.methods.buyNFT(saleId).send({from:address, value:'400000000000000000'});
    console.log(result);
    return result;
    // const result = await sendContract({
    //   functionName: "buyNFT",
    //   arguments: [saleId],
    //   valueInWei: true,
    //   value: price,
    // });
    // return result;
  };

  const claimRaffle = async (roundNo) => {
    if (!contract) return;
    const result = await sendContract({
      functionName: "claimRaffle",
      arguments: [roundNo],
    });
    return result;
  };

  const claimNFTRaffle = async () => {
    if (!contract) return;
    const result = await sendContract({
      functionName: "claimNFTRaffle",
    });
    return result;
  };

  return {
    bet,
    getUserBets,
    getBet,
    mint,
    claimBet,
    getNFTBalance,
    getRaffleResult,
    executeRaffleRound,
    getCurrentRaffleBalance,
    getCurrentRaffleRoundNo,
    getUserRaffleTickets,
    getTotalRaffleTickets,
    cancelSale,
    checkIfNFTOnSale,
    putNFTOnSale,
    buyNFT,
    claimNFTRaffle,
    claimRaffle,
    checkIfClaimableNFTRaffle
  };
};

export default useContract;
