import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import {expect} from 'chai';
import Home from "../index";
import ReduxThunk from "redux-thunk";
import {getFirebase} from "react-redux-firebase";
import {applyMiddleware, createStore} from "redux";
import reducers from "../../../redux/reducers";
import {composeWithDevTools} from "redux-devtools-extension/index";
import {Provider} from "react-redux";

configure({adapter: new Adapter()});

const middleware = [ReduxThunk.withExtraArgument({getFirebase})];
const store = createStore(reducers, composeWithDevTools(
    applyMiddleware(...middleware)
));


describe("Home page", () => {
    it('renders Home page', () => {
        const wrapper = shallow(
            <Provider  store={store}>
                <Home/>
            </Provider>
        );
        expect(wrapper.find(Home)).to.have.lengthOf(1);
    });
});
