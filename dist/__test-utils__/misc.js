"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("./init");
exports.testSuiteFactorySqlUtilDialectBased = (db, testsAll, shouldSkipResolver, _beforeEach) => {
    let testsFactoryMap = Object.keys(testsAll);
    describe(db.dialect, () => {
        beforeEach(async () => {
            if (typeof _beforeEach === 'function') {
                return _beforeEach();
            }
            return shouldSkipResolver() ? void 0 : init_1._initDb(db);
        });
        for (let i = 0; i < testsFactoryMap.length; i++) {
            let key = testsFactoryMap[i];
            let testFactory = testsAll[key];
            let testFn = async () => {
                if (!shouldSkipResolver()) {
                    await testFactory(db);
                }
            };
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
