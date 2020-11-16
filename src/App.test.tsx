import React from 'react';
import {render} from '@testing-library/react';
import {Provider} from 'react-redux';
import App from './App';
import {getFirebase, ReactReduxFirebaseProvider, ReactReduxFirebaseProviderProps} from "react-redux-firebase";
import ReduxThunk from "redux-thunk";
import {applyMiddleware, createStore} from "redux";
import reducers from "./app/redux/reducers";
import firebase from "./firebase";
import {composeWithDevTools} from "redux-devtools-extension/index";


const middleware = [ReduxThunk.withExtraArgument({getFirebase})];
const store = createStore(reducers, composeWithDevTools(
    applyMiddleware(...middleware)
));

const rrfProps: ReactReduxFirebaseProviderProps = {
    firebase,
    config: {},
    dispatch: store.dispatch
}

test('renders app', () => {
    const {getByText} = render(
        <Provider store={store}>
            <ReactReduxFirebaseProvider {...rrfProps}>
                <App/>
            </ReactReduxFirebaseProvider>
        </Provider>
    );

    expect(getByText(/welcome/i)).toBeInTheDocument();
});
