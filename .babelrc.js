module.exports = {
  "presets": [
    [ 
      "@babel/preset-env"
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