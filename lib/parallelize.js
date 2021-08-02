/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => {
  // webpackBootstrap
  /******/ "use strict";
  /******/ var __webpack_modules__ = {
    /***/ "./src/parallelize.ts":
      /*!****************************!*\
  !*** ./src/parallelize.ts ***!
  \****************************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        eval(
          '\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nexports.parallelize = void 0;\nconst constants_1 = __webpack_require__(/*! ./utils/constants */ "./src/utils/constants.ts");\nconst wait_1 = __webpack_require__(/*! ./utils/wait */ "./src/utils/wait.ts");\nconst activeTasks = new Set();\nlet loopIsActive = false;\nconst checkDate = (startTime) => Date.now() - startTime < constants_1.TASKS_LIMIT;\nconst loop = function loop() {\n    return __awaiter(this, void 0, void 0, function* () {\n        if (loopIsActive) {\n            return;\n        }\n        loopIsActive = true;\n        while (true) {\n            if (activeTasks.size === 0) {\n                loopIsActive = false;\n                return;\n            }\n            let taskStartTime = Date.now();\n            tasksLoop: while (checkDate(taskStartTime)) {\n                for (const task of activeTasks) {\n                    if (!checkDate(taskStartTime)) {\n                        break tasksLoop;\n                    }\n                    if (task.aborted) {\n                        activeTasks.delete(task);\n                        continue;\n                    }\n                    try {\n                        task.result = task.generator.next();\n                    }\n                    catch (e) {\n                        activeTasks.delete(task);\n                        task.reject(e);\n                        continue;\n                    }\n                    if (task.result.done) {\n                        activeTasks.delete(task);\n                        task.resolve(task.result.value);\n                        continue;\n                    }\n                }\n            }\n            yield wait_1.wait(constants_1.TASKS_PAUSE);\n        }\n    });\n};\nconst parallelize = function parallelize(generator) {\n    const parallelRunner = function parallelRunner() {\n        const taskInterface = {\n            generator: generator(),\n            aborted: false,\n        };\n        const promise = new Promise((res, rej) => {\n            taskInterface.resolve = res;\n            taskInterface.reject = rej;\n        });\n        activeTasks.add(taskInterface);\n        promise.abort = function abort(resolve = true) {\n            const task = taskInterface;\n            task.aborted = true;\n            if (resolve) {\n                task.resolve(constants_1.Aborted);\n            }\n            else {\n                task.reject(constants_1.Aborted);\n            }\n        };\n        loop();\n        return promise;\n    };\n    return parallelRunner;\n};\nexports.parallelize = parallelize;\n\n\n//# sourceURL=webpack://thread-like/./src/parallelize.ts?'
        );

        /***/
      },

    /***/ "./src/utils/constants.ts":
      /*!********************************!*\
  !*** ./src/utils/constants.ts ***!
  \********************************/
      /***/ (__unused_webpack_module, exports) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nexports.Aborted = exports.TASKS_PAUSE = exports.TASKS_LIMIT = void 0;\nexports.TASKS_LIMIT = 13;\nexports.TASKS_PAUSE = 0;\nexports.Aborted = Symbol("aborted");\n\n\n//# sourceURL=webpack://thread-like/./src/utils/constants.ts?'
        );

        /***/
      },

    /***/ "./src/utils/isAborted.ts":
      /*!********************************!*\
  !*** ./src/utils/isAborted.ts ***!
  \********************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nexports.isAborted = void 0;\nconst constants_1 = __webpack_require__(/*! ./constants */ "./src/utils/constants.ts");\nconst isAborted = (value) => value === constants_1.Aborted;\nexports.isAborted = isAborted;\n\n\n//# sourceURL=webpack://thread-like/./src/utils/isAborted.ts?'
        );

        /***/
      },

    /***/ "./src/utils/wait.ts":
      /*!***************************!*\
  !*** ./src/utils/wait.ts ***!
  \***************************/
      /***/ (__unused_webpack_module, exports) => {
        eval(
          '\nObject.defineProperty(exports, "__esModule", ({ value: true }));\nexports.wait = void 0;\nconst wait = (ms) => new Promise((res) => setTimeout(res, ms));\nexports.wait = wait;\n\n\n//# sourceURL=webpack://thread-like/./src/utils/wait.ts?'
        );

        /***/
      },

    /***/ "./src/browsers.js":
      /*!*************************!*\
  !*** ./src/browsers.js ***!
  \*************************/
      /***/ (
        __unused_webpack___webpack_module__,
        __webpack_exports__,
        __webpack_require__
      ) => {
        eval(
          '__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _parallelize_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parallelize.ts */ "./src/parallelize.ts");\n/* harmony import */ var _utils_isAborted_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/isAborted.ts */ "./src/utils/isAborted.ts");\n\n\n\nwindow.parallelize = _parallelize_ts__WEBPACK_IMPORTED_MODULE_0__.parallelize;\nwindow.parallelize.isAborted = _utils_isAborted_ts__WEBPACK_IMPORTED_MODULE_1__.isAborted;\n\n\n//# sourceURL=webpack://thread-like/./src/browsers.js?'
        );

        /***/
      },

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  /******/ /* webpack/runtime/make namespace object */
  /******/ (() => {
    /******/ // define __esModule on exports
    /******/ __webpack_require__.r = (exports) => {
      /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {
          value: "Module",
        });
        /******/
      }
      /******/ Object.defineProperty(exports, "__esModule", { value: true });
      /******/
    };
    /******/
  })();
  /******/
  /************************************************************************/
  /******/
  /******/ // startup
  /******/ // Load entry module and return exports
  /******/ // This entry module can't be inlined because the eval devtool is used.
  /******/ var __webpack_exports__ = __webpack_require__("./src/browsers.js");
  /******/
  /******/
})();
