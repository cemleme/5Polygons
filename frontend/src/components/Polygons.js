import React, { useEffect, useState } from "react";
import polygon0 from "../assets/polygon0.png";
import polygon1 from "../assets/polygon1.png";
import polygon2 from "../assets/polygon2.png";
import polygon3 from "../assets/polygon3.png";
import polygon4 from "../assets/polygon4.png";

const polygonImages = [polygon0, polygon1, polygon2, polygon3, polygon4];

const Polygons = React.forwardRef(({ roundResult, size, animate }, ref) => {
  const [polygonsArr, setPolygonsArr] = useState([]);

  useEffect(() => {
    const result = roundResult.toString().padStart(5, "0").split("");
    setPolygonsArr(result);
  }, [roundResult]);

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        alignItems: "center",
      }}
      ref={ref}
    >
      {polygonsArr.map((id, index) => (
        <img
          key={index}
          src={polygonImages[id]}
          alt={"polygon" + id}
          style={{
            width: size + "rem",
            height: size * 1.15 + "rem",
            objectFit: "contain",
            animationDuration: "0.5s",
            animationDelay: index * 0.1 + "s",
          }}
          className={animate ? "animate__animated animate__pulse" : ""}
        />
      ))}
    </div>
  );
});

export default Polygons;
