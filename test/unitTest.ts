import * as config from '../src/index';

describe('flowershop test', () => {
    beforeEach(function () {
    });

    describe('#test composer', () => {
        it('check composer config', () => {
            if ((<any>config).functions) {
                throw new Error('Expected functions obejct is declared');
            }
        });
    });
});