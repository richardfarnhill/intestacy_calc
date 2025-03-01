module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
          browsers: [
            '> 1%',
            'last 2 versions',
            'not dead'
          ]
        },
        useBuiltIns: 'usage',
        corejs: 3
      }
    ]
  ],
  plugins: []
};