import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const startingBalanceA = stdlib.parseCurrency(6000)
const startingBalanceB = stdlib.parseCurrency(100);

const accAlice = await stdlib.newTestAccount(startingBalanceA);
const accBob = await stdlib.newTestAccount(startingBalanceB);
console.log('Hello Alice and Bob!');

console.log('Launching...');
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

const getBalance = async (who) =>  stdlib.formatCurrency(await stdlib.balanceOf(who));

console.log(`Alice's balance is: ${await getBalance(accAlice)}`);
console.log(`Bob's balance is: ${await getBalance(accBob)}`);

const choiceArray = ["I'm not here","I'm still here"];

const Common = {
  showTime: (t) => {
    console.log(`Time remaining is ${parseInt(t)}`);
  }
}

console.log('Starting backends...');
await Promise.all([
  backend.Alice(ctcAlice, {
    ...Common,
    insuarance: stdlib.parseCurrency(5000),
    holdFunds: () => {
      const choice = Math.floor(Math.random() * 2);
      console.log(`Alice's choice is ${choiceArray[choice]}`);
      return (choice == 0 ? false : true);
    },
    
  }),
  backend.Bob(ctcBob, {
    ...Common,
    acceptTerms: (num) => {
      console.log(`Bob accepts the terms for ${stdlib.formatCurrency(num)} from Alice`)
      return  true;
    }
  }),
]);

console.log(`Alice's balance is: ${await getBalance(accAlice)}`);
console.log(`Bob's balance is: ${await getBalance(accBob)}`);
console.log('Goodbye, Alice and Bob!');