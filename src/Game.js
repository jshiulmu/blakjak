import { getDefaultEmulatorHost } from '@firebase/util'
import { disableNetwork } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { SignIn, SignOut, useAuthentication } from '../src/services/authService'
import App from './App'

export default function Game(user) {
    const [playing, setPlaying] = useState(true)
    const [playerHand, setPlayerHand] = useState([])
    const [dealerHand, setDealerHand] = useState([])
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
        initialDeal()
    }
    function initialDeal() {
        const base = ''
        const requestURL = base.concat(
            'https://www.deckofcardsapi.com/api/deck/',
            deckID,
            '/draw/?count=2'
        )
        fetch(requestURL)
            .then((response) => {
                if (response.status < 400 && response.status >= 200) {
                    return response.json()
                } else {
                    console.log(response.status)
                    throw new Error()
                }
            })
            .then((cardsList) => setPlayerHand(cardsList.cards))
            .catch(() => setdeckID(null))
        console.log(playerHand)
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
            <div className="Game">
                <header>
                    Blackjack
                    {!user ? <SignIn /> : <SignOut />}
                </header>
                <button
                    className="return_button"
                    onClick={() => {
                        console.log('EXITING')
                        setPlaying(false)
                    }}
                >
                    Return to Menu
                </button>
                <div className="center">
                <img className="DealerCards" src="https://opengameart.org/sites/default/files/card%20back%20red.png" alt="backOfCard"></img>
                <img className="DealerCards" src="https://opengameart.org/sites/default/files/card%20back%20red.png" alt="backOfCard"></img>
                </div>
                <div className="gap"></div>
                <div className="center">
                <img className="PlayerCards" src="https://opengameart.org/sites/default/files/card%20back%20red.png" alt="backOfCard"></img>
                <img className="PlayerCards" src="https://opengameart.org/sites/default/files/card%20back%20red.png" alt="backOfCard"></img>
                </div>
                <div className="PlayerInfo">Player Hand:</div>
                <div className="center">
                <button className="hit_button" onClick={playerHit}>
                    Hit
                </button>
                <button className="stand_button" onClick={stand}>
                    Stand
                </button>
                </div>
            </div>
        )
    ) : (
        <App />
    )
}
