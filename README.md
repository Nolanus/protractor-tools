# protractor-tools [![npm version](https://img.shields.io/npm/v/protractor-tools.svg?style=flat)](https://www.npmjs.com/package/protractor-tools) [![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

> A typescript rewrite of [sg-protractor-tools](https://github.com/SunGard-Labs/sg-protractor-tools) utility library

[![Build Status](https://travis-ci.org/Nolanus/protractor-tools.svg?branch=master)](https://travis-ci.org/Nolanus/protractor-tools)
[![Dependencies Status](https://david-dm.org/Nolanus/protractor-tools.svg?path=projects/ngx-page-scroll)](https://david-dm.org/Nolanus/protractor-tools?path=projects/ngx-page-scroll)
[![Greenkeeper badge](https://badges.greenkeeper.io/Nolanus/protractor-tools.svg)](https://greenkeeper.io/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3b6bcf4d59a84933b03a91561729d609)](https://www.codacy.com/app/sebastian-fuss/protractor-tools?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Nolanus/protractor-tools&amp;utm_campaign=Badge_Grade)

This library provides a reusable and generic set of helper functions for the Protractor test framework. It includes functions that simplify things like browser resizing, scrolling and memory usage tracking as part of a test suite. The project bundles an example application that showcases the functionality.

While using [Protractor](https://github.com/angular/protractor) for testing our [Angular](https://angularjs.org/)-based applications, we have found that we can simplify many of the common tasks done as part of part of our test suite. The Protractor API is fairly low-level in some cases, and we have seen that we can cut down the amount of code for some common tasks by externalizing functionality into a reusable library.

## Installing / Getting started


```shell
npm install -D protractor-tools
```

Install the library as a development dependency using the node package manager of your choice.

### Usage

Import the required util classes in your `*.e2e-spec.ts` files.

```typescript
import { ResizeUtil } from 'protractor-tools';

describe('Resizing demo App', () => {
      it('should resize the browser window a little', () => {
        // ...
        resizeUtil.setWindowSize(1303, 876);
        // ...
      });
});
``` 

## Features

The following utility classes are currently available

- [**ConsoleUtil**](lib/console.ts) (retrieve console logs and convenience methods to ensure your app didn't produce console errors)
- [**DomUtil**](lib/dom.ts) (wait for dom elements to become visible or invisible)
- [**MemoryUtil**](lib/memory.ts) (execute an action multiple times and track the memory footprint of the app)
- [**MouseUtil**](lib/mouse.ts) (drag and drop functionality)
- [**ResizeUtil**](lib/resize.ts) (get and set the browser window and viewport size)
- [**ScrollUtil**](lib/scroll.ts) (scroll to a element, scroll to a coordinate/position or scroll by a number of pixels)

You may refer to the source code of the util classes for usage details or the [forked library documentation](https://github.com/SunGard-Labs/sg-protractor-tools/tree/master/docs) for more information about the reason for the utility classes. 

## Links

- [sg-protractor-tools](https://github.com/SunGard-Labs/sg-protractor-tools/)


## Licensing

The code in this project is licensed under [MIT license](LICENSE).
