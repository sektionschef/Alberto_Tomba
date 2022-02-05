# Tasks
* combine the pixels instead of redrawing
* drauf - impasto details und die rakes, 
* best things: impasto strong and weak
* drunter: thick dry dotsos - oder drüber
* particles: thickpaint rects

* hearbeat - a bissl zucke und dann regelmäßig eine explosion
* strokes mit random angle - drei von ihnen.
* epicentrum - entfernung von einem punkt schwächt die force
* wiederum drei ebenen: canvas - umdrehen + hintergrund dnyamisch vlt. impediments + bälle + drüber vlt.
* change gravity - `engine.world.gravity.y` & `engine.world.gravity.x`

* Epizentrum position
* Staerke Epizentrum

https://github.com/liabru/matter-js/blob/master/examples/timescale.js 

reges für alle zahlen, `(\d+)` von - https://regex101.com/ , https://stackoverflow.com/questions/1043619/get-numbers-from-string-with-regex 

* mit den "px" in regex - https://stackoverflow.com/questions/30342731/javascript-regex-to-find-numbers-followed-by-px-or 

# learnings

make iterations experimentations easy - automation for learning fast, e.g. sprite identification. früher mit der hand elemnte nachgezeichnet, dann digital mit pad und jetzt mit spritecow. 

http://www.spritecow.com/ 

# Environment


FXHASH Generative Token webpack boilerplate
================

You will need to have [nodejs](https://nodejs.org/) installed.

## Installation

* First, make sure that your node version is >= 14
* git clone https://github.com/fxhash/fxhash-webpack-boilerplate.git
* Install the packages required for the local environment ```npm i```

## Start local environment

```sh
$ npm start
```

## Build

```sh
$ npm run build
```

Will bundle your js dependencies into a single minified `bundle.js` file, move your files from the `public/` to the `dist/` folder, and link the `bundle.js` with the `index.html`.

**Moreover, it will create a `dist-zipped/project.zip` file which can be directly imported on fxhash**.

# Develop your token

Once the environment is started, you can edit the `src/index.js` file to start building your artwork. The `index.html` file is located in the `public/` folder.

You can import libraries using `npm` or by adding the library file in the `public/` folder and link those using relative paths in the `index.html`.

Any file in the `public/` folder will be added to the final project. 

# Publish your token

Once you are happy with the results, you can run the following command:

```sh
$ npm run build
```

This will create a `dist-zipped/project.zip` file.

Go to [https://fxhash.xyz/sandbox/](https://fxhash.xyz/sandbox/) and upload the `project.zip` file in there to see if it works properly.

If your token does not work properly, you can iterate easily by updating your files, running `$ npm run build` again, and upload the zip file again.

Finally, you can mint your token using the same `project.zip`file.


# Rules to follow

> Theses rules must be followed to ensure that your token will be future-proof, accepted by fxhash, and behave in the intended way

* the zip file must be under 15 Mb
* any path to a resource must be relative (./path/to/file.ext)
* no external resources allowed, you must put all your resources in the `public/` folder (sub-folders are OK)
* no network calls allowed (but calls to get resources from within your `public/` folder)
* you must handle any viewport size (by implementing a response to the `resize` event of the `window`)
* you **cannot use random number generation without a seed** (the same input hash must always yield the same output). The `fxrand` function does a very good job in that regard.

