"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("./init");
exports.testSuiteFactorySqlUtilDialectBased = (db, testsAll, shouldSkipResolver, _beforeEach) => {
    let testsFactoryMap = Object.keys(testsAll);
    describe(db.dialect, () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            if (typeof _beforeEach === 'function') {
                return _beforeEach();
            }
            return shouldSkipResolver() ? void 0 : init_1._initDb(db);
        }));
        for (let i = 0; i < testsFactoryMap.length; i++) {
            let key = testsFactoryMap[i];
            let testFactory = testsAll[key];
            let testFn = () => __awaiter(void 0, void 0, void 0, function* () {
                if (!shouldSkipResolver()) {
                    yield testFactory(db);
                }
            });
            if (shouldSkipResolver()) {
                key = `skip.${key}`;
            }
            // skip
            if (/^skip\./i.test(key)) {
                test.skip(key, testFn);
            }
            // only
            else if (/^only\./i.test(key)) {
                test.only(key, testFn);
            }
            // normal
            else {
                test(key, testFn);
            }
        }
    });
};
