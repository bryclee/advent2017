function getInput() {
    const input = require('fs').readFileSync('./inputs/day7.txt').toString();

    return input
        .split('\n')
        .filter(x => x)
        .map(line => {
            const [m, name, weight, children] =
                line.match(/(\w*) \((\d*)\)(?: -> (.*)$)?/);
            return {
                name,
                weight: +weight,
                children: children ? children.split(', ') : []
            };
        });
}

class Tower {
    constructor({name, weight}) {
        this.name = name;
        this.weight = weight;
        this.towerWeight = weight;
        this.children = [];
        this.parent = null;
    }

    addChild(c) {
        c.parent = this;

        this.children.push(c);
        this.towerWeight += c.towerWeight;

        if (this.parent) {
            this.parent.towerWeight += c.towerWeight;
        }
    }
}

function linkTower(input) {
    const programs = input.map(p => new Tower(p));
    const programsMap = programs.reduce((a, p) => {
        a[p.name] = p;
        return a;
    }, {});
    let head = null;

    input.forEach(data => {
        const program = programsMap[data.name];

        data.children.forEach(child => {
            program.addChild(programsMap[child]);
        });

        if (!program.parent) head = program;
    });

    return head;
}

function findOutlier(tower) {
    if (!tower.children.length) {
        return null;
    }

    switch (tower.children.length) {
        case 1:
            return findOutlier(tower.children[0]);
        case 2:
            if (tower.children[0].towerWeight === tower.children[1].towerWeight) {
                return null;
            }

            return findOutlier(tower.children[0]) ||
                findOutlier(tower.children[1]) ||
                tower.children[0]; // If neither of the children has the outlier, just pick one
        default:
            if (tower.children[0].towerWeight !== tower.children[1].towerWeight) {
                if (tower.children[0].towerWeight !== tower.children[2].towerWeight) {
                    return findOutlier(tower.children[0]) || tower.children[0];
                } else {
                    return findOutlier(tower.children[1]) || tower.children[1];
                }
            } else {
                const standardWeight = tower.children[0].towerWeight;
                const outlierChild = tower.children.find(c => c.towerWeight !== standardWeight);

                if (!outlierChild) return null;

                return findOutlier(outlierChild) || outlierChild;
            }
    }
}

// Get the name of the top-most program
function test1(input) {
    const tower = linkTower(input);

    return tower.name;
}

// Return the weight the outlier tower should be
function test2(input) {
    const tower = linkTower(input);
    const outlier = findOutlier(tower);
    const standardTowerWeight = outlier.parent.children
        .find(c => c.towerWeight !== outlier.towerWeight).towerWeight;

    return standardTowerWeight - (outlier.towerWeight - outlier.weight);
}

console.log('Test 1:', test1(getInput()));
console.log('Test 2:', test2(getInput()));
