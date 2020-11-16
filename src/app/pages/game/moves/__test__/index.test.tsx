import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import {expect} from 'chai';

import Moves from "../index";
import {historyItem} from "../../../../types";
import {FIRST_PLAYER} from "../../../../constants";

configure({adapter: new Adapter()});

describe("Message", () => {
    it('renders Message', () => {
        const history: historyItem[] = [
            {
                value: 900,
                allowedNumber: 0
            },
            {
                value: 300,
                allowedNumber: 0
            },
            {
                value: 100,
                allowedNumber: -1
            }
        ];

        const wrapper = shallow(
            <Moves player={FIRST_PLAYER} history={history}/>
        );
        expect(wrapper.find('.move-item')).to.have.lengthOf(history.length);
    });
});
