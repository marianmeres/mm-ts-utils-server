"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSqlSchema = void 0;
const fs = require("fs");
const path = require("path");
const colors = require("colors/safe");
exports.getSqlSchema = (schemaDir) => {
    if (!fs.existsSync(schemaDir)) {
        throw new Error(`Schema dir '${schemaDir}' not found`);
    }
    // 1. read sql files list
    let sqlFiles = fs
        .readdirSync(schemaDir)
        .filter((name) => path.extname(name) === '.sql');
    // 2. walk, parse and mark dependency tree (use magic `-- ## require`)
    let sqlDepsGraph = sqlFiles.reduce((g, name) => {
        const deps = [];
        const sql = fs.readFileSync(path.resolve(schemaDir, name)).toString();
        const REGX = /--\s*##\s*require ([\S]+)/;
        const matched = sql.match(RegExp(REGX, 'ig'));
        matched &&
            matched.forEach((_m) => {
                let m = _m.match(RegExp(REGX, 'i'));
                let filename = m[1];
                if (!/\.sql$/.test(filename)) {
                    filename += '.sql';
                }
                deps.push(filename);
            });
        g[name] = deps;
        return g;
    }, {});
    // 3. topologic dependency sort (https://gist.github.com/RubyTuesdayDONO/5006455)
    function resolve(graph) {
        let sorted = []; // sorted list of IDs ( returned value )
        let visited = {}; // hash: id of already visited node => true
        Object.keys(graph).forEach(function visit(name, ancestors) {
            if (!Array.isArray(ancestors)) {
                ancestors = [];
            }
            ancestors.push(name);
            visited[name] = true;
            if (!graph[name]) {
                throw new Error(`Unknown dependency "${name}".`);
            }
            graph[name].forEach((dep) => {
                // if already in ancestors, a closed chain exists.
                if (ancestors.indexOf(dep) >= 0) {
                    throw new Error(`Circular dependency "${dep}" is required by "${name}": ${ancestors.join(' -> ')}`);
                }
                // if already exists, do nothing
                if (visited[dep]) {
                    return;
                }
                visit(dep, ancestors.slice(0)); // recursive call
            });
            if (sorted.indexOf(name) < 0) {
                sorted.push(name);
            }
        });
        return sorted;
    }
    // console.log(sqlDepsGraph); console.log(resolve(sqlDepsGraph));
    // 4. final sort...
    let sqlSchema;
    try {
        sqlSchema = resolve(sqlDepsGraph).reduce((acc, name) => (acc += fs.readFileSync(path.resolve(schemaDir, name))), '');
    }
    catch (e) {
        console.error(colors.red(`SCHEMA: ${e.message}`));
        process.exit(0);
    }
    return sqlSchema;
};
