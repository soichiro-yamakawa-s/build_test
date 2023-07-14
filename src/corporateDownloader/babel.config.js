module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    ie: '11',
                    chrome: '58',
                },
                useBuiltIns: 'usage',
                corejs: 3,
            }
        ],
        '@babel/preset-react',
    ],
    plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-class-properties',
    ]
}