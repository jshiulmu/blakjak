import { getDefaultEmulatorHost } from '@firebase/util'
import { disableNetwork } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { SignIn, SignOut, useAuthentication } from '../src/services/authService'
import App from './App'

export default function Game(user) {
    const [playing, setPlaying] = useState(true)
    const [playerHand, setPlayerHand] = useState(0)
    const [dealerHand, setDealerHand] = useState(0)
    const [gameOver, setGameOver] = useState(false)
    const [deckID, setdeckID] = useState('')
    function fetchDeck() {
        const requestURL =
            'https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
        fetch(requestURL)
            .then((response) => {
                if (response.status < 400 && response.status >= 200) {
                    return response.json()
                } else {
                    console.log(response.status)
                    throw new Error()
                }
            })
            .then((deck) => setdeckID(deck.deck_id))
            .catch(() => setdeckID(null))
        console.log(deckID)
    }

    function playerHit() {
        setPlayerHand(playerHand + Math.random() * 10) //CHANGE TO API CALL
        console.log('Player Hand = ', playerHand)
        if (playerHand > 21) {
            setGameOver(true)
            console.log('USER BUST')
        }
    }

    function dealerHit() {
        setDealerHand(dealerHand + Math.random() * 10) //CHANGE TO API CALL
        console.log('Dealer Hand = ', dealerHand)
    }

    function stand() {
        //FOR SOME REASON, DEALER CANNOT HIT
        dealerHit()
        dealerHit()
        dealerHit()
        if (dealerHand > 21) {
            setGameOver(true)
            console.log('DEALER BUST')
            console.log('USER WINS')
        } else if (dealerHand < 21 && playerHand < dealerHand) {
            setGameOver(true)
            console.log('DEALER WINS')
        } else if (dealerHand < 21 && playerHand > dealerHand) {
            setGameOver(true)
            console.log('USER WINS')
        }
    }

    return playing ? (
        gameOver ? (
            <div className="End_Screen">
                <header>Game Over</header>
                <button
                    className="button"
                    onClick={() => {
                        console.log('EXITING')
                        setPlaying(false)
                    }}
                >
                    Return to Menu
                </button>
            </div>
        ) : (
            <div className="App">
                <header>
                    Blackjack
                    {!user ? <SignIn /> : <SignOut />}
                </header>
                <sideBar>
                    <div>
                        <button className="hit_button" onClick={playerHit}>
                            Hit
                        </button>
                    </div>
                    <div>
                        <button className="CHECK_API" onClick={fetchDeck}>
                            CHECK API
                        </button>
                    </div>
                    <div>
                        <button className="stand_button" onClick={stand}>
                            Stand
                        </button>
                    </div>
                    <div>
                        <button
                            className="button"
                            onClick={() => {
                                console.log('EXITING')
                                setPlaying(false)
                            }}
                        >
                            Return to Menu
                        </button>
                    </div>
                </sideBar>
                <mainArticle>
                    <img
                        src="https://www.thesportsbank.net/wp-content/uploads/2020/04/BLACK-JACK.jpg"
                        alt="mainImage"
                    ></img>
                    Player Hand:
                </mainArticle>
            </div>
        )
    ) : (
        <App />
    )
}
