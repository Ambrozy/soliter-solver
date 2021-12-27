import { prettifyCards } from '../interface';

describe('prettifyCards', () => {
    it('should replace card suite to characteristics', () => {
        expect(prettifyCards('Kk Qc 2b 10p')).toBe(
            'K<span class="black">&#9827;</span> Q<span class="red">&#9829;</span> 2<span class="red">&#9830;</span> 10<span class="black">&#9824;</span>',
        );
    });
});
