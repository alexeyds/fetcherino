module.exports = {
  "presets": [
    [ 
      "@babel/preset-env",
      {
        targets: {
          esmodules: true,
        },
      },
    ]
  ],

  "plugins": [
    [
      "module-resolver",
      {
        "root": [
          "./lib"
        ],
        "alias": {
          "test": "./test",
          "dist": "./dist",
          "support": "./test/support"
        }
      }
    ]
  ],

  "ignore": ["dist"]
}