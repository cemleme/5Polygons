import { useContext } from "react";
import ConnectContext from "./ConnectContext";

const fivePolygonsAddress = "0x0b648FA8d1641e41518fd48d96a6c7d2fdD4F78F";

const useMoralis = () => {
  const { address } = useContext(ConnectContext);
  const getUserNFTs = async () => {
    const data = await fetch(
      `https://deep-index.moralis.io/api/v2/${address}/nft/${fivePolygonsAddress}?chain=mumbai&format=decimal`,
      {
        headers: {
          Accept: "application/json",
          "X-Api-Key":
            "xpVptprzi9BqJXBF2yp9JlwANxraHxzuto1bOqVX36vScckDkrzlbmhPboFMSB4i",
        },
      }
    );

    const nfts = await data.json();
    return nfts.result;
  };

  const getNFTAmount = async (id) => {
    const nfts = await getUserNFTs();
    const result = nfts.find((n) => n.token_id === id.toString());
    return result ? result.amount : 0;
  };

  return { getUserNFTs, getNFTAmount };
};

export default useMoralis;
