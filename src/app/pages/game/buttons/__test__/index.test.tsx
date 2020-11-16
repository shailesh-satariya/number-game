import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import {expect} from 'chai';

import Buttons from "../index";
import CONFIG from "../../../../config";

configure({adapter: new Adapter()});

describe("Buttons", () => {
    it('renders Buttons', () => {
        const wrapper = shallow(
            <Buttons addNextMove={(value) => {}} disabled={false} allowedNumber={0}  />
        );
        expect(wrapper.find('button')).to.have.lengthOf(CONFIG.numbers.length);
    });
});
