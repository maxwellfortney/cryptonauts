const Cryptonauts = artifacts.require("Cryptonauts");

module.exports = function (deployer, network, accounts) {
    console.log("Profits will be sent to: ", accounts[0]);
    deployer.deploy(Cryptonauts, accounts[0]);
};
