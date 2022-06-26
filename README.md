# Todo dApp with Solididty, Alchemy, and Hardhat

## Getting Started

Clone the repository and change directory to the todo-dapp-tutorial directory:

```bash
git clone https://github.com/hulyak/todo-dapp-tutorial.git
cd todo-dapp-tutorial
```

Create a `.env` file and add the following lines:

```bash
ALCHEMY_URL="paste your Alchemy HTTPS URL"
WALLET_PRIVATE_KEY="paste your MetaMask private key"
```

Install the dependencies from terminal:

```bash
npm install

# run tests
npx hardhat test  

# deploy the smart contract to the Goerli test network
npx hardhat run scripts/deploy.js --network goerli
```

After deploying the smart contract, open the `frontend/config.js` file and paste your `contractAddress`.

```js
export const TaskContractAddress = "0x...";
```


Navigate to the `frontend` directory and run the following command:

```bash
cd frontend

npm install 

npm start
```

Now you can visit `localhost:3000` and see the Todo list decentralized application.

Make sure to connect to the `goerli` network and connect to `localhost:3000` from MetaMask.

If you're new to MetaMask, follow the tutorial [here]().