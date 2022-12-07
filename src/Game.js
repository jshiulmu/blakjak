import { getDefaultEmulatorHost } from '@firebase/util'
import { connectFirestoreEmulator, disableNetwork } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { SignIn, SignOut, useAuthentication } from '../src/services/authService'
import App from './App'

export default function Game(user) {
    const [playing, setPlaying] = useState(true)
    const [playerHand, setPlayerHand] = useState(null)
    const [dealerHand, setDealerHand] = useState(null)
    const [gameOver, setGameOver] = useState(false)
    const [deckID, setdeckID] = useState('')
    function fetchDeck() {
        //DEAL DECK_ID IS NULL ON FIRST DEAL, AND ALWAYS ID BEHIND THE STATE VARIABLE
        const requestURL = 'https://www.deckofcardsapi.com/api/deck/new/'
        return fetch(requestURL)
            .then((response) => {
                if (response.status < 400 && response.status >= 200) {
                    return response.json()
                } else {
                    console.log(`NOOOOOOOOOOOO ${response.status}`)
                }
            })
            .then((deck) => {
                setdeckID(deck.deck_id)
                return deck.deck_id //WHEN RETURNED LIKE THIS, THIS RETURN VALUE IS PASSED AS PARAMETER TO NEXT FUNCTION - TOAL
            })
            .then(shuffleDeck)
    }

    function shuffleDeck(deckId_shuffle) {
        const base = ''
        console.log(`Trying to shuffle with deck id ${deckID}`)
        const requestURL = base.concat(
            'https://www.deckofcardsapi.com/api/deck/',
            deckId_shuffle,
            '/shuffle/'
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
            .then((deck) => {
                setdeckID(deck.deck_id)
                return deck.deck_id
            })
            .then(initialDeal)
    }
    function initialDeal(deckId_initial_deal) {
        const base = ''
        const requestURL = base.concat(
            'https://www.deckofcardsapi.com/api/deck/',
            deckId_initial_deal,
            '/draw/?count=4'
        )
        return fetch(requestURL)
            .then((response) => {
                if (response.status < 400 && response.status >= 200) {
                    return response.json()
                } else {
                    console.log(response.status)
                    throw new Error()
                }
            })
            .then((cardsList) => setDealerHand(cardsList)) //SET TO FIRST TWO CARDS IN LIST --> HOW TO INDEX LIST IN REACT?
            .then((cardsList) => setPlayerHand(cardsList)) //SET TO SECOND TWO CARDS IN LIST
            .then(() => {
                console.log('player hand = ', playerHand)
                console.log('dealer hand = ', dealerHand)
            })
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
                <button className="hit_button" onClick={fetchDeck}>
                    Deal
                </button>
                <button
                    className="hit_button"
                    onClick={(event) => {
                        playerHit()
                        console.log(`DeckID = ${deckID}`)
                    }}
                >
                    Hit
                </button>
                <button className="stand_button" onClick={stand}>
                    Stand
                </button>
                <button
                    className="return_button"
                    onClick={() => {
                        console.log('EXITING')
                        setPlaying(false)
                    }}
                >
                    Return to Menu
                </button>
                <div className="PlayerInfo">Player Hand:</div>
            </div>
        )
    ) : (
        <App />
    )
}
