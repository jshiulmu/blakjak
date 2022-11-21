import logo from "./logo.svg";
import "./App.css";
import {
  SignIn,
  SignOut,
  useAuthentication,
} from "../src/services/authService";

export default function App() {
  const user = useAuthentication();

  return (
    <div className="App">
      <header className="App-header">{!user ? <SignIn /> : <SignOut />}</header>
    </div>
  );
}
