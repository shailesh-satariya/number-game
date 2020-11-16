import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import {getFirebase, ReactReduxFirebaseProvider, ReactReduxFirebaseProviderProps} from 'react-redux-firebase';
import {composeWithDevTools} from 'redux-devtools-extension';
import "bootstrap/dist/css/bootstrap.css";

import './index.css';
import App from './App';
import reducers from './app/redux/reducers';
import firebase from './firebase';

const middleware = [ReduxThunk.withExtraArgument({getFirebase})];
const store = createStore(reducers, composeWithDevTools(
    applyMiddleware(...middleware)
));

const rrfProps: ReactReduxFirebaseProviderProps = {
    firebase,
    config: {},
    dispatch: store.dispatch
}

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ReactReduxFirebaseProvider {...rrfProps}>
                <App/>
            </ReactReduxFirebaseProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
