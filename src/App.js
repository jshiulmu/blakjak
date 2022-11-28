import logo from "./logo.svg";
import "./App.css";
import {
  SignIn,
  SignOut,
  useAuthentication,
} from "../src/services/authService";

export default function App() {
  const user = useAuthentication();

  //Button in header

  return (
    <div className="App">
      <header>
        Blackjack
        {!user ? <SignIn /> : <SignOut />}
      </header>
      <sideBar>
        <div><button type="button">Play</button></div>
        <div><button type="button">Settings</button></div>
        <div><button type="button">Leaderboards</button></div>
        <div><button type="button">Exit</button></div>
      </sideBar>
      <mainArticle>
        <img src="https://www.thesportsbank.net/wp-content/uploads/2020/04/BLACK-JACK.jpg" alt="mainImage"></img>
      </mainArticle>
    </div>
  );
}
