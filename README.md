# gulp-ts-spellcheck
Spellcheck typescript code with gulp

[![GitHub issues](https://img.shields.io/github/issues/srfrnk/gulp-ts-spellcheck.svg)](https://github.com/srfrnk/gulp-ts-spellcheck/issues)
[![GitHub stars](https://img.shields.io/github/stars/srfrnk/gulp-ts-spellcheck.svg)](https://github.com/srfrnk/gulp-ts-spellcheck/stargazers)

![Travis (.org)](https://img.shields.io/travis/srfrnk/gulp-ts-spellcheck.svg)
[![Coverage Status](https://img.shields.io/coveralls/srfrnk/gulp-ts-spellcheck.svg)](https://coveralls.io/github/srfrnk/gulp-ts-spellcheck)

> A [gulp](https://gulpjs.com/) plugin for spell checking typescript sources.

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/getting-started/what-is-npm):

```
npm install -D gulp-ts-spellcheck
```

## Usage

```javascript
const gulp = require('gulp');
const tsSpellcheck = require('gulp-ts-spellcheck').default;

gulp.task('spellcheck', (done) => {
  return gulp.src('src/**/*.ts')
    .on('error', (err) => { done(err); })
    .pipe(tsSpellcheck({/* speller options */}))
    .pipe(tsSpellcheck.report({/* reporter options */}));
});
```

## Configuration

### Speller Options

#### dictionary
> string[]: List of words to pass as correct (**case-insensitive**)
```javascript
.
.
.
.pipe(tsSpellcheck({
    dictionary:['axios','fs']
}))
.
.
.
```

Or create a dictionary file `dictionary.js`:
```javascript
module.exports=[
    'axios',
    'fs'
];
```

Then use it in your `gulpfile.js`:
```javascript
.pipe(tsSpellcheck({
    dictionary: require('./dictionary')
}))
```
