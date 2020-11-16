import React from 'react';
import {connect} from 'react-redux';
import firebase from "firebase";

import {addGameData, exitGame, removeGameData, updateGameData} from '../../redux/actions';
import {gameRef, infoRef, playerRef} from "../../../firebase";
import CONFIG from "../../config";

import Buttons from "./buttons";
import Message from "./message";
import Moves from "./moves";
import {FIRST_PLAYER, RESULT_LOST, RESULT_WON, SECOND_PLAYER} from "../../constants";
import {GameState, historyItem} from "../../types";


interface GameComponentState {
    gameRefKey: string | null;
    history: historyItem[];
    player: number;
    loading: boolean;
    isWaiting: boolean;
    wrongMove: boolean;
}

interface GameComponentProps {
    game: GameState;
    addGameData: Function;
    updateGameData: Function;
    removeGameData: Function;
    exitGame: Function;
}

/**
 * is multiple of 2
 *
 * @param number
 * @returns {boolean}
 */
const isEven = (number: number): boolean => number % 2 === 0;

class Game extends React.Component<GameComponentProps, GameComponentState> {
    state: GameComponentState = {
        gameRefKey: null,
        history: [],
        player: FIRST_PLAYER,
        loading: true,
        isWaiting: false,
        wrongMove: false
    }

    scrollRef: any = React.createRef();

    componentDidMount(): void {
        this.detectPlayers();
    }

    componentWillReceiveProps(nextProps: GameComponentProps, nextContext: GameComponentProps) {
        const {gameRefKey} = this.state;

        // set state
        if (nextProps.game.refKey && !gameRefKey) {
            const key = nextProps.game.refKey;
            this.setState({gameRefKey: key}, () => {
                const prepareData = {
                    key,
                    payload: {gameRefKey: key}
                };
                this.props.updateGameData(prepareData);

                // add firebase real-time listener
                this.addFirebaseRealTimeListener();
            });
        }
    }

    /**
     * detect players
     */
    detectPlayers = (): void => {
        // player
        playerRef
            .once('value', (snap) => {
                if (!snap.exists() || snap.numChildren() < 2) {
                    // detect active game players
                    this.handleActivePlayers();
                } else {
                    // exit game
                    this.props.exitGame();
                }
            }).then()
    };

    /**
     * handle active game players
     */
    handleActivePlayers = () => {
        const currentUserRef = playerRef.push();

        // monitor connection state on browser tab
        infoRef
            .on('value', (snap) => {
                if (snap.val()) {
                    // off listener
                    infoRef.off();

                    // if network is lost then remove this user from the list
                    currentUserRef.onDisconnect().remove().then();

                    // set user
                    currentUserRef.set(true).then();
                }
            });

        // detect users (once)
        playerRef
            .once('value', (snap) => {
                const totalUsers = snap.numChildren();

                // for two players
                if (totalUsers <= 2) {
                    // display game view
                    this.setState({loading: false});

                    // on player disconnect
                    this.onPlayerDisconnect();
                }

                // validate game
                if (totalUsers === 1) {
                    // remove game data (old)
                    this.props.removeGameData();

                    // init game
                    this.initGame();
                } else {
                    gameRef
                        .once('value', (snaps: firebase.database.DataSnapshot) => {
                            if (snaps.exists()) {
                                const snapshots: Record<string, any>[] = Object.values(snaps.val());

                                // set state
                                this.setState({
                                    gameRefKey: snapshots[0].gameRefKey,
                                    history: snapshots[0].history,
                                    player: SECOND_PLAYER
                                }, () => {
                                    // add firebase real-time listener
                                    this.addFirebaseRealTimeListener();
                                });
                            }
                        })
                        .then();
                }
            })
            .then();
    };


    /**
     * write a current player disconnect
     */
    onPlayerDisconnect = () => {
        // when user disconnected (on)
        playerRef
            .once('child_removed', () => {
                const {history} = this.state;
                const lastHistoryItem = history[history.length - 1];

                // check if game is finished or interrupted
                if (lastHistoryItem && lastHistoryItem.value !== 1) {
                    // remove
                    playerRef.remove().then();

                    // end game
                    this.endGame(null, true);
                }
            })
            .then();
    };

    /**
     * add firebase real-time listener
     */
    addFirebaseRealTimeListener = () => {
        const {gameRefKey} = this.state;

        if (!gameRefKey) {
            return;
        }

        gameRef
            .child(gameRefKey)
            .on('value', (snap) => {
                if (snap.exists()) {
                    const data = snap.val();
                    const lastHistoryItem = data.history[data.history.length - 1];

                    this.setState({history: data.history}, () => {
                        // validate game state
                        this.validateGameState(lastHistoryItem.value);
                    });

                    // after second user made a move
                    if (data && data.history.length > 1) {
                        // disable wait
                        this.setState({isWaiting: false});
                    } else if (!this.state.isWaiting) {
                        // enable wait
                        this.setState({isWaiting: true});
                    }
                }
            });
    };

    /**
     * init game
     */
    initGame = () => {
        // generate random whole number between minNumber - maxNumber

        const { maxNumber, minNumber } = CONFIG;
        const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;

        // update game
        this.updateGame(randomNumber);
    };

    /**
     * update game state: firebase and redux
     *
     * @param value
     */
    updateGame = (value: number): void => {
        const {history, gameRefKey} = this.state;
        const allowedNumber = this.getNumberForNextMove(value);
        const dataPayload = {
            value,
            allowedNumber
        };
        const updateHistory = history.concat(dataPayload);

        // set state
        this.setState({history: updateHistory}, () => {
            // first push to database when game starts
            if (!gameRefKey) {
                const prepareData = {
                    payload: {history: updateHistory}
                };
                this.props.addGameData(prepareData);
            } else {
                const prepareData = {
                    key: gameRefKey,
                    payload: {history: updateHistory}
                };
                this.props.updateGameData(prepareData);
            }
        });
    };

    /**
     * end game
     *
     * @param result
     * @param isDisconnected
     */
    endGame = (result: number | null = null, isDisconnected: boolean = false) => {
        this.props.exitGame(result);

        const {player} = this.state;

        if (player !== FIRST_PLAYER || isDisconnected) {
            playerRef.remove().then();
        }
    };

    /**
     * evaluate number for next move
     *
     * @param num
     * @returns {string}
     */
    getNumberForNextMove = (num: string | number) => {
        const pn: number = parseInt(num as string);
        const {numbers, divider} = CONFIG;

        for (const n of numbers) {
            if ((n + pn) % divider === 0) {
                return n;
            }
        }

        return 0;
    };

    /**
     * add next move
     *
     * @param action
     * @returns {Function}
     */
    addNextMove = (action: string | number) => {
        const {history} = this.state;
        const oldValue = history[history.length - 1];
        const value = (oldValue.value + (Number(action))) / 3;

        // update game
        this.updateGame(Math.ceil(value));

        // remove wrong
        this.setState({wrongMove: false});
    };

    /**
     * validate game state
     *
     * @param number
     */
    validateGameState = (number: number) => {
        // scroll element to end
        this.scrollRef.current.scrollTop = Number.MAX_SAFE_INTEGER


        // if number reaches 1, finish the game and declare the winner.
        if (number === 1) {
            const {history, player} = this.state;
            const even = isEven(history.length);

            const state = ((even && player === SECOND_PLAYER) || (!even && player === FIRST_PLAYER)) ? RESULT_LOST : RESULT_WON;

            // end game
            this.endGame(state, false);
        }
    };

    render(): JSX.Element {
        const {history, player} = this.state;

        const even: boolean = isEven(history.length);
        const turn: boolean = !!history.length && ((!even && player === SECOND_PLAYER) || (even && player === FIRST_PLAYER));

        const allowedNumber: number = history.length ? this.getNumberForNextMove(history[history.length - 1].value) : 0;


        return (
            <div className="d-flex flex-column vh-100 h-100 bg-light">
                <div className="bg-info text-white">
                    <h3>Number game</h3>
                </div>
                <Message turn={turn}/>
                <div className="flex-grow-1" style={{overflowY: 'auto'}} ref={this.scrollRef}>
                    <Moves history={this.state.history} player={player}/>
                </div>
                <div className="text-white text-center">
                    <Buttons addNextMove={this.addNextMove} allowedNumber={allowedNumber} disabled={!turn}/>
                </div>

            </div>
        );
    }
}

// props
const mapStateToProps = (state: Record<string, any>) => ({
    game: state.game
});

export default connect(mapStateToProps, {addGameData, updateGameData, removeGameData, exitGame})(Game);
