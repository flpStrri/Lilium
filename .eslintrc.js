module.exports = {
  "extends": "airbnb",
  "rules": {
    "semi": [2, "never"],
    "import/extensions": ["always"],
    "import/no-unresolved": ["always"],
    "react/jsx-filename-extension": ["never"],
    "import/prefer-default-export": ["never"],
    "import/no-extraneous-dependencies": ["error", {"devDependencies": ["**/*.test.js", "**/factory.js"]}],
    "no-underscore-dangle": "off",
    "no-else-return": "off",
    "react/no-unused-prop-types": [1, "always"],
    "max-len": [0, "never"],
  },
  "env": {
    "jest/globals": true,
    "browser": true,
  },
  "plugins": ["jest"]
}
