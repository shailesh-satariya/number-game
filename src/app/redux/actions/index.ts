import {Dispatch} from 'redux';
import * as actionTypes from '../types';
import {GameData} from "../../types";

// start game
const startGame = (type: string): Function => {
    return (dispatch: Dispatch) => {
        dispatch({
            type: actionTypes.START_GAME,
            payload: type
        });
    };
};

// add game data
const addGameData = (data: GameData) => {
    return (dispatch: Dispatch, getState: Record<string, any>, {getFirebase}: any) => {
        const firebase = getFirebase();
        const gameRef = firebase.database().ref('game');

        const entry = gameRef
            .push(data.payload);

        dispatch({
            type: actionTypes.ADD_GAME_DATA,
            payload: entry.key
        });
    }
};

// update game data
const updateGameData = (data: GameData) => {
    return (dispatch: Dispatch, getState: Record<string, any>, {getFirebase}: any) => {
        const firebase = getFirebase();
        const gameRef = firebase.database().ref('game');

        gameRef
            .child(data.key)
            .update(data.payload)
            .then();

        dispatch({
            type: actionTypes.UPDATE_GAME_DATA
        });
    }
};

// remove game data
const removeGameData = (data: GameData) => {
    return (dispatch: Dispatch, getState: Record<string, any>, {getFirebase}: any) => {
        const firebase = getFirebase();
        const gameRef = firebase.database().ref('game');

        gameRef.remove().then();

        dispatch({
            type: actionTypes.REMOVE_GAME_DATA
        });
    }
};


// exit game
const exitGame = (result: number | null) => {
    return (dispatch: Dispatch) => {
        dispatch({
            type: actionTypes.EXIT_GAME,
            payload: result
        });
    };
};

export {
    startGame,
    addGameData,
    updateGameData,
    removeGameData,
    exitGame
};
