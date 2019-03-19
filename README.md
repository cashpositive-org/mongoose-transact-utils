# mongoose-transact-utils

Helper methods for Mongoose and MongoDB transactions (Check out [this medium](https://medium.com/cashpositive/the-hitchhikers-guide-to-mongodb-transactions-with-mongoose-5bf8a6e22033) post to know more about it). 

The library comes with @types for Typescript users. 

[![NPM Version](https://img.shields.io/npm/v/mongoose-transact-utils.svg?style=flat)](https://www.npmjs.org/package/mongoose-transact-utils)


## Installation

```shell
npm i mongoose-transact-utils
```

OR

```shell
yarn add mongoose-transact-utils
```

## API Reference and Examples

[API Reference - Docs](https://cashpositive.github.io/mongoose-transact-utils/)

### A simple use case for transaction

```js
const { runInTransaction } = require('mongoose-transact-utils');

const { User } = require('./models');

// any queries or write you want to do using transaction
(async () => {
  // runInTransction catches any error in the callback to abort the transaction session
  // and then rethrows the error for you to handle the reporting
  await runInTransaction(async session => {
    // run any queries here
    await addFriend('John', 'Jane', session);
  });

  console.log('John and Jane are friend now!');
})();

async function addFriend(nameA, nameB, session) {
  const userA = await User.find({ name: nameA }).session(session);
  const userB = await User.find({ name: nameB }).session(session);

  userA.friends.push(userB._id);
  userB.friends.push(userA._id);

  await userA.save();
  await userB.save();
}
```


# Contributing
We are more than happy to accept contributions to this project in form of feedback, bug reports and pull requests.

References: 
- https://mongoosejs.com/docs/transactions.html
- https://docs.mongodb.com/manual/core/write-operations-atomicity/
- [NPM Package](https://www.npmjs.com/package/mongoose-transact-utils)
- [Medium Post](https://medium.com/cashpositive/the-hitchhikers-guide-to-mongodb-transactions-with-mongoose-5bf8a6e22033)

# Contributors
- Soumyajit [@drenther](https://github.com/drenther)
- Sharad [@csharad](https://github.com/csharad)
- Nitish [@nitish-mehta](https://github.com/nitish-mehta)
- [CashPositive](https://www.cashpositive.in)


