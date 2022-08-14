import { useEffect, useState } from "react";
import Polygons from "./Polygons";

const BetExample = ({ roundResult, resultName, payout, isResult }) => {
  const [rowStyle, setRowStyle] = useState({
    width: "23rem",
    display: "flex",
    gap: "1rem",
    paddingLeft: "10px",
    borderRadius: "10px",
  });

  useEffect(() => {
    setRowStyle((s) => ({
      ...s,
      backgroundColor: isResult ? "#fff" : "transparent",
    }));
  }, [isResult]);

  return (
    <div style={rowStyle}>
      <Polygons roundResult={roundResult} size={2} />
      <div style={{ color: isResult ? "black" : "white", display: "flex", alignItems: "center" }}>
        {resultName} <br /> Payout: x{payout}
      </div>
    </div>
  );
};

export default BetExample;
