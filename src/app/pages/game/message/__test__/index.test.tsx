import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import {expect} from 'chai';

import Message from "../index";

configure({adapter: new Adapter()});

describe("Message", () => {
    it('renders Message', () => {
        const wrapper = shallow(
            <Message turn={true}/>
        );
        expect(wrapper.find('.alert-success')).to.have.lengthOf(1);
    });
});
