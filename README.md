# ReFund

## Regenerative Funding

ReFund is a crowdfunding platform built for the polygon ecosystem, to incentivise developers to build open-source protocols and project by contributing to their development and get updates on the development phase of the protocol.

### What problem does ReFund solve ?

Most developers build open source project (the code can be used by anyone), but when other developers use their code, they dont usually get anything from it (they are not compensated or even acknowledged in some cases). ReFund is crowdfunding platform built by a developer for developers, by incentivsing developers we are also growing and bettering the ecosystem.

### What does ReFund do ?

1). ReFund is a platform where developers can list their project to get funding from the community to incentivise their continually building.

2). ReFund also make developers aware of the open-source project they have utlised, they can know the name of the developer (for acknowlegdement), they can also donate to the project if they found it useful or liked it.

3). ReFund brings developers of like minds together, if you are interested in a project you saw on the ReFund platform, you can reach out to the team behind it to maybe assist them or give a personal feedback on your like and dislikes about the project.

### What are the stacks for ReFund ?

ReFund is currently using a locally hosted moralis parse server (mongoDB and heroku) to store all the data and queries, some may propose to store it in a smart contract but we do not what a user to have to send multiple transactions to save and edit their data.

ReFund is currently on the ploygon blockchain and will be expanding to other blockchain (even outside evm) in the near future.

ReFund is built with react with make the UI render a little faster to some what compensate for the slow database queries and calls.

### What is to come in the future for ReFund ?

ReFund will undergo major improvements in the future.  
if ReFund is recognised by the polygon team and ecosystem, we will be taking in request and feature updates from the community.  
ReFund will undergo structural UI changes.  
ReFund will complete all the planned integration for the hackathon (searchbar, up and down vote, amount donated e.t.c)  
ReFund will upgrade it database to premuim to get faster calls and queries.  
ReFund will be live on ploygon mainnet and will start move to ethereum.

## 



<details >
  <summary><h3>Hackathon submission details</h3></summary>
<br>

## Getting Started

clone the github repo.

```
npm install
```
add `--force` if the install fails.        
create a .env file at the root and add the the following variables

```
REACT_APP_SERVER_URL = ""
REACT_APP_APPLICATION_ID = 
REACT_APP_INFURA_ID = 
```

I hosted my own server, you can contact me for the credentials       

then `npm start`

---


### DEPLOYED CONTRACTS:

POLYGON MUMBAI:

https://mumbai.polygonscan.com/address/0x1101ccc32b66e0ccc2b555aa7aad1227ab030722      
- [Smart Contracts](https://github.com/xcrispy/ReFund/blob/main/src/contracts/ReFund.sol)

- [Front End](https://github.com/xcrispy/ReFund)
</details>

![refund-pdf Page 03 Snapshot 03](https://user-images.githubusercontent.com/98023462/199255882-fc27f2d6-b8f4-4ad8-a5eb-b395edc33986.png)
