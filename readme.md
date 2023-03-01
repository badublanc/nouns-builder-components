# Nouns Builder Components

Nouns Builder Components is a collection of reusable, lightly-styled React components designed for DAOs built with Nouns Builder. [Builder DAO](https://nouns.build/dao/0xdf9b7d26c8fc806b1ae6273684556761ff02d422/vote/0xbb6d9919efb59b500451dd8d923201d0a7bc1ced3a8320dd57888eef9ee3c139) funded the initial development of the library—with credit to [ripe0x](https://github.com/ripe0x) (design and development) and [badublanc](https://github.com/badublanc) (development).

> **Note**
>
> This library is for technical users. Check out the [easy-to-use builder](https://buildercomponents.wtf/) to embed the components without coding!

[Click here to preview all the components](https://buildercomponents.wtf/)!

---

## Installation

You can install the library and its peer dependencies with your favorite package manager.

```bash
# npm
npm i nouns-builder-components wagmi ethers^5 @rainbow-me/rainbowkit

# yarn
yarn add nouns-builder-components wagmi ethers^5 @rainbow-me/rainbowkit
```

## Setup

Once installed, import the `BuilderDAO` provider and component stylesheet. Wrap your application with `BuilderDAO`, `RainbowKitProvider`, and `WagmiConfig`. Instructions for setting up wagmi and rainbowkit are available in the [RainbowKit installation documentation](https://www.rainbowkit.com/docs/installation).

A working setup can be found on [CodeSanbox](https://codesandbox.io/s/builder-components-demo-zyfyd2?file=/src/index.js).

```jsx
// ...
import 'nouns-builder-components/index.css';
import { BuilderDAO } from 'nouns-builder-components';

// ...

export default function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        {/* Purple Dao */}
        <BuilderDAO
          collection="0xa45662638E9f3bbb7A6FeCb4B17853B7ba0F3a60"
          chain="MAINNET"
        >
          <YourApp />
        </BuilderDAO>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
```

## Usage

Now, import and use the desired components in your application.

```jsx
import { AuctionHero, CollectionList, useDao } from 'nouns-builder-components';

export default function App() {
  const dao = useDao();

  if (!dao) return <></>;
  return (
    <div className="App">
      <AuctionHero dao={dao} />
      <CollectionList dao={dao} />
    </div>
  );
}
```

See a working demo on [CodeSandbox](https://codesandbox.io/s/builder-components-demo-zyfyd2?file=/src/App.jsx).

---

## Components

Each component needs the `dao` prop, which you can get by with the `useDao` hook. Each component also accepts an `opts` prop: an object configuring the theme and other options.

Components include:

- AuctionHero
- CollectionList
- MemberList
- ProposalList
- Treasury
- PropHouseRounds
- PropHouseProps

### ⭐️ AuctionHero

**Options**

| key      | value                              |
| -------- | ---------------------------------- |
| `theme?` | `base` or `dark` - default: `base` |

**Example Usage**

```jsx
import { AuctionHero, useDao } from 'nouns-builder-components';

export default function App() {
  const dao = useDao();

  if (!dao) return <></>;
  return <AuctionHero dao={dao} opts={{ theme: 'base' }} />;
}
```

### ⭐️ CollectionList

**Options**

| key              | value                              |
| ---------------- | ---------------------------------- |
| `theme?`         | `base` or `dark` - default: `base` |
| `rows?`          | `number` - default: `3`            |
| `itemsPerRow?`   | `number` - default: `5`            |
| `sortDirection?` | `ASC` or `DESC` - default: `ASC`   |
| `hideLabels?`    | `boolean` - default: `true`        |

**Example Usage**

```jsx
import { CollectionList, useDao } from 'nouns-builder-components';

export default function App() {
  const dao = useDao();

  if (!dao) return <></>;
  return <CollectionList dao={dao} opts={{ theme: 'dark', rows: 2 }} />;
}
```

### ⭐️ MemberList

**Options**

| key            | value                              |
| -------------- | ---------------------------------- |
| `theme?`       | `base` or `dark` - default: `base` |
| `rows?`        | `number` - default: `3`            |
| `itemsPerRow?` | `number` - default: `6`            |

**Example Usage**

```jsx
import { MemberList, useDao } from 'nouns-builder-components';

export default function App() {
  const dao = useDao();

  if (!dao) return <></>;
  return <MemberList dao={dao} opts={{ rows: 5, itemsPerRow: 5 }} />;
}
```

### ⭐️ ProposalList

**Options**

| key              | value                              |
| ---------------- | ---------------------------------- |
| `theme?`         | `base` or `dark` - default: `base` |
| `sortDirection?` | `ASC` or `DESC` - default: `DESC`  |
| `max?`           | `number` - default: `10`           |

**Example Usage**

```jsx
import { ProposalList, useDao } from 'nouns-builder-components';

export default function App() {
  const dao = useDao();

  if (!dao) return <></>;
  return <ProposalList dao={dao} opts={{ sortDirection: 'ASC', max: 5 }} />;
}
```

### ⭐️ Treasury

**Options**

| key      | value                              |
| -------- | ---------------------------------- |
| `theme?` | `base` or `dark` - default: `base` |

**Example Usage**

```jsx
import { Treasury, useDao } from 'nouns-builder-components';

export default function App() {
  const dao = useDao();

  if (!dao) return <></>;
  return <Treasury dao={dao} />;
}
```

### ⭐️ PropHouseRounds

**Options**

| key              | value                              |
| ---------------- | ---------------------------------- |
| `houseId`        | `number`                           |
| `theme?`         | `base` or `dark` - default: `base` |
| `rows?`          | `number` - default: `3`            |
| `itemsPerRow?`   | `number` - default: `2`            |
| `sortDirection?` | `ASC` or `DESC` - default: `DESC`  |

**Example Usage**

```jsx
import { PropHouseRounds, useDao } from 'nouns-builder-components';

export default function App() {
  const dao = useDao();

  if (!dao) return <></>;
  return <PropHouseRounds dao={dao} opts={{ houseId: 17 }} />;
}
```

### ⭐️ PropHouseProps

**Options**

| key       | value                              |
| --------- | ---------------------------------- |
| `houseId` | `number`                           |
| `round`   | `string`                           |
| `theme?`  | `base` or `dark` - default: `base` |
| `max?`    | `number` - default: `12`           |
| `format?` | `grid` or `list` - default: `list` |

**Example Usage**

```jsx
import { PropHouseProps, useDao } from 'nouns-builder-components';

export default function App() {
  const dao = useDao();

  if (!dao) return <></>;
  return (
    <PropHouseProps
      dao={dao}
      opts={{ houseId: 17, round: 'Retroactive Funding' }}
    />
  );
}
```
