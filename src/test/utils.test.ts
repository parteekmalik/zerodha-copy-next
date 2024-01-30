// math.test.ts

import { parsePrice } from "../app/zerodha/utils";




describe('Math functions', () => {
    test('parsePrice passed', () => {
        expect(parsePrice("0.01234")).toBe(0.01234);
        expect(parsePrice("0.45800000")).toBe(0.458);
        expect(parsePrice("0.00054000")).toBe(0.00054);
    });
});