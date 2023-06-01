const axios = require('axios');

//this function retrieves transaction history form the uniswap
async function getUniswapTransactionHistory(address) {
  try {
    const url = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';
    const query = `
      query {
        swaps(where: {sender: "${address}"}) {
          id
          amount0In
          amount1In
          amount0Out
          amount1Out
          amountUSD
        }
      }
    `;
    const response = await axios.post(url, { query });
    if (response.status === 200) {
      return response.data.data.swaps;
    } else {
      console.log(`Failed to fetch transaction history for address: ${address}`);
      return [];
    }
  } catch (error) {
    console.log(`Failed to fetch transaction history for address: ${address}`);
    return [];
  }
}
// profit and loss calculator
// this function calculate profit and loss

function calculateUniswapProfitLoss(address) {
  getUniswapTransactionHistory(address)
    .then(transactions => {
      if (transactions.length === 0) {
        console.log('No transaction history found for the provided address.');
        return;
      }

      let profit = 0;
      let loss = 0;
// extracting amount of token input ,token outputand value of transaction
      for (const tx of transactions) {
        const amountIn = tx.amount0In !== '0' ? tx.amount0In : tx.amount1In;
        const amountOut = tx.amount0Out !== '0' ? tx.amount0Out : tx.amount1Out;
        const amountUSD = tx.amountUSD;
        // calculating profit and loss
        const transactionProfit = Number(amountUSD) - Number(amountIn) + Number(amountOut);

        if (transactionProfit > 0) {
          profit += transactionProfit;
        } else {
          loss -= transactionProfit;
        }
      }

      console.log('Profit:', profit);
      console.log('Loss:', loss);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

// addresses array
const walletAddresses = [
   ` 0xd66816E75997a44D630b1Ea477E87073256c77fc`
     `0xD79b937791724e47F193f67162B92cDFbF7ABDFd`
    ` 0x48202A51c0d5d81b3ebeD55016408a0E0a0afaaE`
    ` 0x6137a5ad28999b189ade0150e7B418e9D86bc560`
    ` 0x4b2A62efD6cc5a0714be3754Dc4c71893BB26eDb`
   `  0x49D29b200A9F8929D1E368A00097372E41794399`
    ` 0x5159A56aDbEa403e0B5a74dFC8d9d00861c086FB`
  `   0xC97cfd2c3a3E61316E931B784BdE21e61Ce15b82`
   `  0xe2823659bE02E0F48a4660e4Da008b5E1aBFdF29`
  `   0x41D5C91836Cb9fbBB644C30aC4278bEFEC52cAeE`
    ` 0x49A323CC2fa5F9A138f30794B9348e43065D8dA2`
    ` 0xab0648Ae3b7623Ce87BFBc4932dBBB8472635Df3`
    // add more address
];
// itearting over addresses and calling function
for (const address of walletAddresses) {
  console.log(`Calculating profit and loss for address: ${address}`);
  calculateUniswapProfitLoss(address);
}
