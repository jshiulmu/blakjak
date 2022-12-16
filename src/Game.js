import { getDefaultEmulatorHost } from '@firebase/util'
import { wait } from '@testing-library/user-event/dist/utils'
import { connectFirestoreEmulator, disableNetwork } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { SignOut, useAuthentication } from '../src/services/authService'
import { SignIn } from './App.js'
import App from './App'

export default function Game(user) {
    const [playing, setPlaying] = useState(true)
    const [playerHand, setPlayerHand] = useState(null)
    const [dealerHand, setDealerHand] = useState(null)
    const [playerAceCount, setPlayerAceCount] = useState(0)
    const [playerAsubbed, setPlayerASubbed] = useState(0)
    const [dealerAsubbed, setDealerASubbed] = useState(0)
    const [dealerAceCount, setDealerAceCount] = useState(0)
    const [gameOver, setGameOver] = useState(false)
    const [userStanding, setUserStanding] = useState(false)
    const [deckID, setdeckID] = useState('')
    const [gameOverMessage, setGameOverMessage] = useState('')
    let deckId_regular = ''
    let playerHand_regular = null
    let dealerHand_regular = null
    let dealerAceCount_regular = 0
    let playerAceCount_regular = 0
    let gameOver_regular = false

    function fetchDeck() {
        //API CALL TO FETCH THE DECK
        setPlayerHand(null)
        setDealerHand(null)
        setDealerAceCount(0)
        setPlayerAceCount(0)
        playerHand_regular = null
        dealerHand_regular = null
        gameOver_regular = false

        const requestURL =
            'https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
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
                deckId_regular = deck.deck_id
                initialDeal(deckId_regular)
            })
    }

    function initialDeal(deckId_regular) {
        //API CALL TO DEAL THE CARDS INITIALLY
        console.log('INITIAL DEAL OF CARDS')
        const requestURL = `https://www.deckofcardsapi.com/api/deck/${deckId_regular}/draw/?count=2`
        fetch(requestURL)
            .then((response) => {
                //FETCH API FOR DEALER HAND
                if (response.status < 400 && response.status >= 200) {
                    return response.json()
                } else {
                    console.log(response.status)
                    throw new Error()
                }
            })
            .then((cardsList) => (dealerHand_regular = cardsList.cards))
            .then(() => {
                setDealerHand(dealerHand_regular)
            })
            .then(() =>
                fetch(requestURL) //FETCH API FOR PLAYER HAND
                    .then((response) => {
                        if (response.status < 400 && response.status >= 200) {
                            return response.json()
                        } else {
                            console.log(response.status)
                            throw new Error()
                        }
                    })
                    .then((cardsList) => (playerHand_regular = cardsList.cards))
                    .then(() => {
                        setPlayerHand(playerHand_regular)
                    })
                    .then(() => {
                        console.log(
                            'Initial Player Hand: ',
                            findCardSum(playerHand_regular)
                        )
                        console.log(
                            'Initial Dealer Hand ',
                            findCardSum(dealerHand_regular)
                        )
                        setDealerHand(dealerHand_regular)
                        setPlayerHand(playerHand_regular)
                        dealerAceCount_regular = checkAces(dealerHand_regular)
                        playerAceCount_regular = checkAces(playerHand_regular)
                        setDealerAceCount(dealerAceCount_regular)
                        setPlayerAceCount(playerAceCount_regular)
                        gameUpdate(playerHand_regular, dealerHand_regular)
                        console.log(playerHand)
                    })
            )
    }

    function playerHit() {
        //API CALL TO ADD ONE CARD FROM DECK TO USER'S HAND
        console.log('PLAYER HITTING')
        const requestURL = `https://www.deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`
        return fetch(requestURL)
            .then((response) => {
                if (response.status < 400 && response.status >= 200) {
                    return response.json()
                } else {
                    console.log(`NOOOOOOOOOOOO Hit ${response.status}`)
                }
            })
            .then(
                (card) =>
                    (playerHand_regular = append(playerHand, [card.cards[0]]))
            )
            .then(() => {
                setPlayerHand(playerHand_regular)
                playerAceCount_regular = checkAces(playerHand_regular)
                setPlayerAceCount(playerAceCount_regular)
                gameUpdate(playerHand_regular, dealerHand, false)
                console.log(playerHand)
                if (findCardSum(playerHand, 'P') > 21) {
                    setGameOver(true)
                    console.log('PLAYER BUST HERE')
                    setGameOverMessage('PLAYER HAS BUSTED')
                }
            })
    }

    function dealerHit(dealerHand_regular) {
        //API CALL TO ADD ONE CARD FROM DECK TO USER'S HAND
        if (!gameOver && findCardSum(dealerHand) <= findCardSum(playerHand)) {
            //IF DEALER LESS THAN USER, HIT
            console.log('Dealer HITTING')
            const requestURL = `https://www.deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`
            return fetch(requestURL)
                .then((response) => {
                    if (response.status < 400 && response.status >= 200) {
                        return response.json()
                    } else {
                        console.log(`NOOOOOOOOOOOO ${response.status}`)
                    }
                })
                .then(
                    (card) =>
                        (dealerHand_regular = append(dealerHand_regular, [
                            card.cards[0],
                        ]))
                )
                .then(() => {
                    setDealerHand(dealerHand_regular)
                    dealerAceCount_regular = checkAces(dealerHand_regular)
                    setDealerAceCount(dealerAceCount_regular)
                    if (!gameUpdate(playerHand, dealerHand_regular, true)) {
                        if (findCardSum(dealerHand) > 21) {
                            setGameOver(true)
                            console.log('HERE, DEALER LOST')
                        } else if (
                            findCardSum(dealerHand) > findCardSum(playerHand)
                        ) {
                            setGameOver(true)
                            console.log('DEALER HAS BEATEN THE USER, HERE HERE')
                        } else {
                            dealerHit(dealerHand_regular)
                        }
                    }
                })
        } else if (findCardSum(dealerHand) > findCardSum(playerHand)) {
            console.log('DEALER SHOULD BE STANDING')
            gameUpdate(playerHand, dealerHand_regular, true)
            setGameOver(true)
            setGameOverMessage('DEALER HAS BEATEN THE USER')
        }
    }

    function gameUpdate(player, dealer, local_userStanding) {
        let player_sum = findCardSum(player, 'P')
        let dealer_sum = findCardSum(dealer, 'D')
        let PLAYER = 'PLAYER WINS'
        let DEALER = 'DEALER WINS'
        console.log('GAME UPDATE:')
        console.log(`player sum`, player_sum)
        console.log(`dealer sum`, dealer_sum)
        if (player_sum > 21) {
            //PLAYER BUST
            if (playerAceCount_regular > 0) {
                for (let i = 0; i < playerAceCount_regular; i++) {
                    if (player_sum > 21) {
                        player_sum -= 10
                    } else {
                        break
                    }
                }
                setPlayerAceCount(playerAceCount_regular)
                if (player_sum > 21) {
                    gameOver_regular = true
                    setGameOver(gameOver_regular)
                    console.log(DEALER)
                    setGameOverMessage('PLAYER BUST, DEALER WINS')
                    return true
                }
            } else {
                gameOver_regular = true
                setGameOver(gameOver_regular)
                console.log(DEALER)
                setGameOverMessage('PLAYER BUST, DEALER WINS')
                return true
            }
        }
        if (dealer_sum > 21) {
            console.log('ace count: ', dealerAceCount_regular)
            //DEALER BUST
            if (dealerAceCount_regular > 0) {
                for (let i = 0; i < dealerAceCount_regular; i++) {
                    if (dealer_sum > 21) {
                        dealer_sum -= 10
                    } else {
                        break
                    }
                }
                if (dealer_sum > 21) {
                    gameOver_regular = true
                    setGameOver(gameOver_regular)
                    console.log(PLAYER)
                    setGameOverMessage('DEALER BUST, PLAYER WINS')
                    return true
                }
                setDealerAceCount(dealerAceCount_regular)
            } else {
                gameOver_regular = true
                setGameOver(gameOver_regular)
                console.log(PLAYER)
                setGameOverMessage('DEALER BUST, PLAYER WINS')
                return true
            }
        }
        console.log('User Standing: ', local_userStanding)
        if (local_userStanding && dealer_sum > player_sum) {
            //DOES NOT WORK
            //DEALER SHOULD STAND IF BEATEN USER
            console.log('GameUpdate_LOSS')
            gameOver_regular = true
            setGameOver(gameOver_regular)
            console.log('THIS IS WORKING')
            setGameOverMessage('DEALER WINS, DEALER STANDS W/ MORE THAN PLAYER')
            return true
        }

        if (dealer_sum === 21) {
            //DEALER BLACKJACK
            gameOver_regular = true
            setGameOver(gameOver_regular)
            console.log(DEALER)
            setGameOverMessage('DEALER BLACKJACK')
            return true
        }
        if (player_sum === 21) {
            //PLAYER BLACKJACK
            gameOver_regular = true
            setGameOver(gameOver_regular)
            console.log(PLAYER)
            setGameOverMessage('PLAYER BLACKJACK')
            return true
        }
        console.log('player sum : ', player_sum)
        console.log('player cards : ', player)
        console.log('dealer sum : ', dealer_sum)
        console.log('dealer cards : ', dealer)
        return false
    }

    function checkAces(userHand_json) {
        var ace_count = 0
        for (let i = 0; i < userHand_json.length; i++) {
            if (userHand_json[i].value === 'ACE') {
                ace_count++
            }
        }
        return ace_count
    }

    function findCardSum(userHand_json, player) {
        var card_sum = 0
        for (let i = 0; i < userHand_json.length; i++) {
            if (
                userHand_json[i].value === 'QUEEN' ||
                userHand_json[i].value === 'KING' ||
                userHand_json[i].value === 'JACK'
            ) {
                card_sum += 10
            } else if (userHand_json[i].value === 'ACE') {
                card_sum += 11
            } else {
                card_sum += parseInt(userHand_json[i].value)
            }
        }
        return card_sum
    }

    function append(list1, list2) {
        //HELPER FUNCTION TO APPEND ITEM TO LIST
        var appended_list = list1.concat(list2)
        return appended_list
    }

    function stand() {
        //FOR SOME REASON, DEALER CANNOT HIT
        setUserStanding(true)
        dealerHit(dealerHand)
    }

    return playing ? (
        gameOver ? (
            <div className="Game_over">
                <header>
                    Blackjack
                    {!user ? <SignIn /> : <SignOut />}
                </header>
                <button
                    className="returnButton"
                    onClick={() => {
                        console.log('EXITING')
                        setPlaying(false)
                    }}
                >
                    Return to Menu
                </button>
                
                <div className="center">
                    {!dealerHand
                        ? null
                        : dealerHand.map((card) => {
                              return (
                                  <img
                                      className="DealerCards"
                                      src={card.image}
                                      alt=""
                                  />
                              )
                          })}
                </div>
                <p></p>
                <div>&nbsp;</div>
                <p></p>
                <div>&nbsp;</div>
                <div className="center">
                    {!playerHand
                        ? null
                        : playerHand.map((card) => {
                              return (
                                  <img
                                      className="PlayerCards"
                                      src={card.image}
                                      alt=""
                                  />
                              )
                          })}
                </div>
                <div className="Game_over_message">{gameOverMessage}</div>
                <p></p>
            </div>
        ) : (
            <div className="Game">
                <header>
                    Blackjack
                    {!user ? <SignIn /> : <SignOut />}
                </header>
                <button
                    className="playerHit"
                    onClick={(event) => {
                        fetchDeck()
                    }}
                >
                    Deal
                </button>
                <button
                    className="returnButton"
                    onClick={() => {
                        console.log('EXITING')
                        setPlaying(false)
                    }}
                >
                    Return to Menu
                </button>
                <div className="center">
                    {!dealerHand
                        ? null
                        : dealerHand.map((card) => {
                              return (
                                  <img
                                      className="DealerCards"
                                      src={card.image}
                                      alt=""
                                  />
                              )
                          })}
                </div>
                <p></p>
                <div>&nbsp;</div>
                <p></p>
                <div>&nbsp;</div>
                <div className="center">
                    {!playerHand
                        ? null
                        : playerHand.map((card) => {
                              return (
                                  <img
                                      className="PlayerCards"
                                      src={card.image}
                                      alt=""
                                  />
                              )
                          })}
                </div>
                <p></p>
                <div className="PlayerInfo">
                    Player Hand:{' '}
                    {playerHand !== null ? findCardSum(playerHand, 'P') : 0}
                </div>
                <div className="PlayerButtons">
                    <button
                        className="playerHit"
                        onClick={(event) => {
                            playerHit()
                        }}
                    >
                        Hit
                    </button>
                    <button className="playerStay" onClick={stand}>
                        Stand
                    </button>
                </div>
            </div>
        )
    ) : (
        <App />
    )
}
