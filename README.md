# smart-contract-playground
A playground to test with ETH smart contracts from the browser

### Install packages
```
npm install
```

### Install Truffle
```
npm install -g truffle
```

### [Optional] Install **Ganache**
Download From:  
https://www.trufflesuite.com/ganache

### Run contract migration
```
truffle migrate [--reset] --network <network name: rinkeby | ropsten>
```

### Verify contract
```
truffle run verify <ContractNameWithoutSolExtension> --network <network name: rinkeby | ropsten>
```
