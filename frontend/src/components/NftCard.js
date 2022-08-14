import { useEffect, useState } from "react";
import "./NftCard.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import useContract from "../hooks/useContract";
import useMoralis from "../hooks/useMoralis";

const NftCard = ({ nft, showDetails }) => {

  const ipfsLink = () => {
    return nft.token_uri.replace("ipfs.moralis.io:2053", "ipfs.io"); 
  }

  const paddedId = (token_id) => {
    return token_id.toString().padStart(5, "0");
  };

  return (
    <div className="card" key={nft.token_id}>
      <img
        className="cardAvatar"
        src={`https://ipfs.io/ipfs/bafybeic7xskazt6r3uvo6et75u4p7svi5ajb5fqay57k3s3bnv4dl4dnpm/${paddedId(
          nft.token_id
        )}.png`}
        alt="PolygonRoll NFT"
      />
      {showDetails && (
        <div className="container">
          <h4 className="cardTitle">
            <b>#{paddedId(nft.token_id)}</b> Balance: {nft.amount}
          </h4>
          <p className="cardTitle">
            <a href={ipfsLink()} rel="noreferrer" target="_blank">
              Metadata
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default NftCard;
