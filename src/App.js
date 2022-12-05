import logo from "./logo.svg";
import { useEffect, useState } from "react";

import "./App.css";
import {
  SignIn,
  SignOut,
  useAuthentication,
} from "../src/services/authService";

export default function App() {
  const user = useAuthentication();

  const [playing, setPlaying] = useState(false);

  //Button in header
  return playing ? (
    <div className="Game"></div>
  ) : (
    <div className="App">
      <header>
        Blackjack
        {!user ? <SignIn /> : <SignOut />}
      </header>
      <sideBar>
        <div>
          <button type="button">Play</button>
        </div>
        <div>
          <button type="button">Settings</button>
        </div>
        <div>
          <button type="button">Leaderboards</button>
        </div>
        <div>
          <button
            type="button"
            onclick={() => {
              window.close();
            }}
          >
            Exit
          </button>
        </div>
      </sideBar>
      <mainArticle>
        <img
          src="https://www.thesportsbank.net/wp-content/uploads/2020/04/BLACK-JACK.jpg"
          alt="mainImage"
        ></img>
      </mainArticle>
    </div>
  );
}
