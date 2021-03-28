const HDWalletProvider = require("@truffle/hdwallet-provider");
const path = require("path");

module.exports = {
    contracts_build_directory: path.join(__dirname, "src/contracts"),
    networks: {
        rinkeby: {
            provider: function () {
                return new HDWalletProvider(
                    "7e1cef9859dd7cc0607b4a5885d7b0d1caa6f4640d40a104fa386d8f4816f833",
                    "https://rinkeby.infura.io/v3/48dbaad3d97f4f6abebb51c4df73e834"
                );
            },
            network_id: "*",
        },
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*", // Match any network id
        },
    },
    compilers: {
        solc: {
            version: "^0.8.0",
            parser: "solcjs",
        },
    },
};
