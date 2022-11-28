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
      </sideBar>
      <mainArticle>
      </mainArticle>
    </div>
  );
}
