function createKey({ x, y }) {
    return `${x},${y}`;
}

function parseKey(key) {
    const [x, y] = key.split(',');

    return {
        x: +x,
        y: +y
    };
}

class Spiral {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.left = 0;
        this.right = 0;
        this.up = 0;
        this.down = 0;
        this._data = {};
        this.next = [1, 0];
    }

    currentKey() {
        return createKey(this);
    }

    get(key) {
        return this._data[key];
    }

    set(key, n) {
        this._data[key] = n;
    }

    moveNext() {
        const [ changeX, changeY ] = this.next;

        if (changeX) {
            if (changeX > 0 && changeX + this.x > this.right) {
                this.right++;
                this.x++;
                this.next = [ 0, 1 ];
            } else if (changeX < 0 && changeX + this.x < this.left) {
                this.left--;
                this.x--;
                this.next = [ 0, -1 ];
            } else {
                this.x = this.x + changeX;
                this.next = [ changeX, changeY ];
            }
        } else if (changeY) {
            if (changeY > 0 && changeY + this.y > this.up) {
                this.up++;
                this.y++;
                this.next = [ -1, 0 ];
            } else if (changeY < 0 && changeY + this.y < this.down) {
                this.down--;
                this.y--;
                this.next = [ 1, 0 ];
            } else {
                this.y = this.y + changeY;
                this.next = [ changeX, changeY ];
            }
        }
    }

    add(n) {
        if (this.get(createKey(this))) {
            this.moveNext();
        }
        this.set(createKey(this), n);
    }

    getVisual() {
        const res = [];

        for (let y = this.up; y >= this.down; y--) {
            const row = [];

            for (let x = this.left; x <= this.right; x++) {
                const key = createKey({ x, y });

                row.push(this.get(key));
            }

            res.push(row);
        }

        return res;
    }

    print() {
        const data = this.getVisual();
        const transformed = data.map(
                r => r.map(
                    n => typeof n === 'number' ? n.toString() : ' '
                    )
                )

        console.log(transformed.map(r => r.join('  ')).join('\n'))
        console.log('----');
    }
}

function test1(n) {
    const s = new Spiral();

    for (let i = 1; i <= n; i++) {
        s.add(i);
    }

    return Math.abs(s.x) + Math.abs(s.y);
}

function test2(n) {
    const s = new Spiral();
    const getLastVal = () => s.get(s.currentKey());

    s.add(1);

    while (s.get(s.currentKey()) <= n) {
        s.moveNext();

        const { x, y } = parseKey(s.currentKey());
        const surroundingSum = [
            { x: x + 1, y },
            { x: x + 1, y: y + 1},
            { x, y: y + 1 },
            { x: x - 1, y: y + 1},
            { x: x - 1, y },
            { x: x - 1, y: y - 1},
            { x: x, y: y - 1 },
            { x: x + 1, y: y - 1 }
        ].map(d => s.get(createKey(d)))
            .filter(d => d)
            .reduce((a, b) => a + b, 0);

        s.add(surroundingSum);
    }

    return s.get(s.currentKey());
}

const input = 289326;

console.log('Test 1:', test1(input));
console.log('Test 2:', test2(input));
