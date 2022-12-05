import logo from "./logo.svg";
import { useEffect, useState } from "react";
import "./App.css";
import Game from "./Game.js";
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
    <Game user={user} />
  ) : (
    //WELCOME SCREEN
    <div className="App">
      <header>
        Blackjack
        {!user ? <SignIn /> : <SignOut />}
      </header>
      <sideBar>
        <div>
          <button
            className="button"
            onClick={() => {
              setPlaying(true);
              console.log("PLAYING");
            }}
          >
            Play
          </button>
        </div>
        <div>
          <button className="button">Settings</button>
        </div>
        <div>
          <button className="button">Leaderboards</button>
        </div>
        <div>
          <button
            className="button"
            onClick={() => {
              console.log("EXITING");
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
