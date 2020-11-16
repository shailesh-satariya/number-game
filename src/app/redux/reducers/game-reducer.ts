import {AnyAction} from 'redux';
import * as actionTypes from '../types';
import {GameState} from "../../types";
import {RESULT_NONE} from "../../constants";

// init game state
const initGameState: GameState = {
    start: false,
    refKey: null,
    result: RESULT_NONE,
};

// reducer: Game
const gameReducer = (state = initGameState, action: AnyAction): GameState => {
    switch (action.type) {
        case actionTypes.START_GAME:
            return {
                ...state,
                start: true,
                result: 0
            };
        case actionTypes.EXIT_GAME:
            return {
                ...state,
                start: false,
                result: action.payload || RESULT_NONE
            };
        case actionTypes.ADD_GAME_DATA:
            return {
                ...state,
                refKey: action.payload
            };
        case actionTypes.SET_RESULT:
            return {
                ...state,
                result: action.payload
            };
        default:
            return state;
    }
};

export default gameReducer;
