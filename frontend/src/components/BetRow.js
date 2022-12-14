import Polygons from "./Polygons";
import BetResult from "./BetResult";
import IconButton from "../components/IconButton";

const BetRow = ({ round, handleClaim, handleMint }) => {

  return (
    <>
      <hr />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
          width: "100%",
        }}
      >
        <BetResult bet={round} />

        <div
          style={{
            width: "100%",
            display: "flex",
            gap: "10px",
            justifyContent: "space-between",
          }}
        >
          <Polygons roundResult={round.result} size={2} />
          {(!round.claimed && round.resultType !== "0") && (
            <IconButton
              text="CLAIM"
              isSmall={true}
              handler={() => handleClaim([round.epoch])}
            />
          )}
          {!round.minted && (
            <IconButton
              text="MINT"
              isSmall={true}
              handler={() => handleMint([round.epoch])}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default BetRow;
