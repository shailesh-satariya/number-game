import React from 'react';
import {connect} from 'react-redux';
import './App.css';
import Home from './app/pages/home';
import Game from "./app/pages/game";
import {GameState} from "./app/types";

interface AppProps {
    gameState: GameState
}

const App = ({gameState}: any): JSX.Element => {
    return (
        <div className="App">
            {gameState.start ? <Game/> : <Home/>}
        </div>
    );
};

// props
const mapStateToProps = (state: Record<string, any>): AppProps => ({
    gameState: state.game
});

export default connect(mapStateToProps)(App);
