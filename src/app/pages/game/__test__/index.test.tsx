import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import {expect} from 'chai';
import ReduxThunk from "redux-thunk";
import {getFirebase} from "react-redux-firebase";
import {applyMiddleware, createStore} from "redux";
import reducers from "../../../redux/reducers";
import {composeWithDevTools} from "redux-devtools-extension/index";
import {Provider} from "react-redux";
import Game from "../index";

configure({adapter: new Adapter()});

const middleware = [ReduxThunk.withExtraArgument({getFirebase})];
const store = createStore(reducers, composeWithDevTools(
    applyMiddleware(...middleware)
));

describe("Game page", () => {
    it('renders Game', () => {
        const wrapper = shallow(
            <Provider  store={store}>
                <Game/>
            </Provider>
        );
        expect(wrapper.find(Game)).to.have.lengthOf(1);
    });
});
