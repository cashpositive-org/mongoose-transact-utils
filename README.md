# mongoose-transact-utils

Helper methods for Mongoose and MongoDB transactions. The library comes with @types for Typescript users.

## Installation

```shell
npm i mongoose-transact-utils
```

OR

```shell
yarn add mongoose-transact-utils
```

## API Reference and Examples

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

### Usage with several different mongoose APIs

```js
const { runInTransaction } = require('mongoose-transact-utils');
const { User } = require('./models');

async function example() {
  await runInTransaction(async session => {
    // all the query methods listed here - https://mongoosejs.com/docs/queries.html
    // session works with query methods as follows -
    const user = await User.findOne({}).session(session);

    // as mentioned earlier, if you use save
    // it will use the associated session ($session)
    await users.save();

    // apart from using $session to set another session
    // you can also pass it as an option
    await users.save({ session });

    // you can also use the options object for passing session
    await User.find({}, null, { session });

    // works with where as well
    await User.where({}).session(session);

    // anywhere where queryOptions object can be passed, it accepts the session
    // for example
    await User.create(
      [
        /* some date */
      ],
      { session }
    );
    await User.bulkWrite(
      [
        /* some update commands */
      ],
      { session }
    );

    // session can be used with aggregation as well
    await User.aggregate([
      /* pipeline */
    ]).session(session);

    // here is an example with populate, skip, limit, etc.
    // you can chain session like all other similiar methods
    await User.find({})
      .skip(10)
      .limit(10)
      .populate('address')
      .session(session);
  });
}
```
