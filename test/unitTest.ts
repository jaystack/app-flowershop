import * as config from '../src/index';

describe('Calculator', () => {
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