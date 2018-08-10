'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-addons-test-utils';
import HistorySearch from "../../../js/components/history/HistorySearch";

describe('HistorySearch', function () {
    const intlData = require('../../../js/i18n/en');
    let searchData = {},
        handlers = {
            handleChange: jasmine.createSpy('handleChange'),
            handleSearch: jasmine.createSpy('handleSearch'),
            handleReset: jasmine.createSpy('handleReset')
    };

    it('renders search with 3 inputs and 2 buttons', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <table>
                    <tbody>
                        <HistorySearch handlers={handlers} searchData={searchData}/>
                    </tbody>
                </table>
            </IntlProvider>);
        const inputs = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input');
        expect(inputs.length).toEqual(3);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'button');
        expect(buttons.length).toEqual(2);
    });
});
