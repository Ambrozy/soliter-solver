export const prettifyCards = (cards: string) =>
    cards
        .replace(/([0-9JQKA])p/g, '$1<span class="black">&#9824;</span>')
        .replace(/([0-9JQKA])c/g, '$1<span class="red">&#9829;</span>')
        .replace(/([0-9JQKA])k/g, '$1<span class="black">&#9827;</span>')
        .replace(/([0-9JQKA])b/g, '$1<span class="red">&#9830;</span>');
