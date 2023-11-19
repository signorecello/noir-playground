
export const monacoConfig = {

    defaultToken: 'invalid',

    keywords: [
        'fn', "mod", "use", "struct", "if", "else", "for", "constrain",
        "global", "comptime", "pub", "in", "as", "let", "true", "false"
    ],

    typeKeywords: [
        'Field', "witness", "bool", "str"
    ],

    operators: [
        '=', '>', '<', '!', '==', '<=', '>=', '!=',
        '+', '-', '*', '/', '&', '|', '<<', '>>'
    ],

    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*/%]+/,


    // The main tokenizer for our languages
    tokenizer: {
        root: [

            // types
            [/(u|i)\d+/, 'type'],

            // identifiers and keywords
            [/[a-z_$][\w$]*/, {
                cases: {
                    '@typeKeywords': 'type',
                    '@keywords': 'keyword',
                    '@default': 'identifier'
                }
            }],
            [/[A-Z][\w$]*/, 'type.identifier'],  // to show class names nicely


            // whitespace
            { include: '@whitespace' },

            // delimiters and operators
            [/[{}()[\]]/, '@brackets'],

            [/\d+/, 'number'],

            // delimiter: after number because of .\d floats
            [/[;,.]/, 'delimiter'],

        ],

        comment: [
            [/\/\//, 'comment']
        ],

        whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/\/\/.*$/, 'comment'],
        ],
    },

};
