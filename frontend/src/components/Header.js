import { useEffect, useContext, useState } from "react";
import "./Header.css";
import ConnectContext from "../hooks/ConnectContext";
import { Link, useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import useContract from "../hooks/useContract";
import { useSelector } from "react-redux";

function CustomLink({ children, to, ...props }) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <div>
      <Link className={match ? "active" : " "} to={to} {...props}>
        {children}
      </Link>
    </div>
  );
}

const Header = () => {
  const { address, connect, disconnect } = useContext(ConnectContext);
  const { getCurrentRaffleBalance } = useContract();
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  const handleDisconnect = () => {
    disconnect();
    navigate("/");
  };

  const handleConnect = () => {
    connect();
  };

  useEffect(() => {
    const loadBalance = async () => {
      const _balance = await getCurrentRaffleBalance();
      setBalance(_balance);
    };
    loadBalance();
  }, []);

  return (
    <div className="topnav">
      <div className="left-links">
        <>
          <CustomLink to="/">Game</CustomLink>
          <CustomLink to="/nfts">NFTs</CustomLink>
          <CustomLink to="/raffle">
            Raffle {parseFloat(balance) > 0 && `(${balance} MATIC)`}
          </CustomLink>
        </>
      </div>
      <div className="right-links">
        {!address && <button onClick={handleConnect}>Connect</button>}
        {address && (
          <button onClick={handleDisconnect}>
            Disconnect {address.substring(0, 4) + "..." + address.slice(-4)}
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
