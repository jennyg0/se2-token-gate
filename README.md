# Token-Gated Content Extension for Scaffold-ETH 2
This extension introduces an ERC-20 token (GateToken) and a TokenGateContract to demonstrate how to restrict access to content or features based on token ownership. Users can only access gated content if they hold a specified amount of GateToken.

The GateToken contract is implemented using the ERC-20 token implementation from OpenZeppelin, ensuring security and compatibility.

## Installation
You can install this extension using Scaffold-ETH by running the following command:

```
npx create-eth@latest -e jennyg0/se2-token-gate
```

## Setup Extension
Deploy your contracts by running:

```
yarn deploy
```

This will deploy both the GateToken and TokenGateContract to your configured network.
**Important Note:** When deploying the contracts, make sure to use the correct wallet address as the deployment account (msg.sender). This address will become the owner of the GateToken contract, with exclusive rights to mint new tokens.

## Interact with the Contract
Start the front-end with:

```
yarn start
```

You can update the code for the frontend at packages/nextjs/app/tokengate/page.tsx.
