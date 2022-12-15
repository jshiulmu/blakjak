import logo from './logo.svg'
import { useEffect, useState } from 'react'
import { db } from '../src/services/firebaseConfig.js'
import Game from './Game.js'
import './App.css'
import { SignOut, useAuthentication } from '../src/services/authService'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { getDoc } from 'firebase/firestore'
import { auth } from './services/firebaseConfig.js'
import { updateUser } from './services/userService'

export default function App() {
    const user = useAuthentication()

    const [playing, setPlaying] = useState(false)

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
                            setPlaying(true)
                            console.log('PLAYING')
                        }}
                    >
                        Play
                    </button>
                </div>
                <div>
                    <button className="button">Leaderboards</button>
                </div>
                <div>
                    <button
                        className="button"
                        onClick={() => {
                            console.log('EXITING')
                            window.close()
                        }}
                    >
                        Exit
                    </button>
                </div>
            </sideBar>
            <img
                className="titleImg"
                src="https://www.thesportsbank.net/wp-content/uploads/2020/04/BLACK-JACK.jpg"
                alt="mainImage"
            ></img>
        </div>
    )
}
export function SignIn() {
    const user = useAuthentication()
    return (
        <button
            onClick={(event) => {
                signInWithPopup(auth, new GoogleAuthProvider())
                
                .then ((user) => {
                    if (user) {
                        updateUser(user)
                    }
                })
            }}
        >
            Sign In
        </button>
    )
}
