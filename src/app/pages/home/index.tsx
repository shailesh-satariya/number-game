import React from 'react';
import {connect} from 'react-redux';

import {startGame} from '../../redux/actions';
import {GameState} from "../../types";
import {RESULT_LOST, RESULT_NONE, RESULT_WON} from "../../constants";

interface HomeProps {
    gameState: GameState;
    startGame?: () => void;
}

const Home = ({gameState, startGame}: HomeProps): JSX.Element => {
    return (
        <div className="d-flex justify-content-center w-100">
            <div className="w-50" style={{maxWidth: '530px'}}>
                <div className="border m-5 pt-3 pr-5 pb-2 pl-5">
                    <div className="text-center mb-3">
                        <h4>
                            {gameState.result === RESULT_WON && 'You won!'}
                            {gameState.result === RESULT_LOST && 'You lost!'}
                            {gameState.result === RESULT_NONE && 'Welcome to number game!'}
                        </h4>
                    </div>
                    <div className="form-group row justify-content-center">
                        <button type="button" className="btn btn-primary" onClick={startGame}>Play
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// props
const mapStateToProps = (state: Record<string, any>): HomeProps => ({
    gameState: state.game
});


export default connect(mapStateToProps, {startGame})(Home);
