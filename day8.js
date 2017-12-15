const getInput = () => {
    const raw = require('fs').readFileSync('./inputs/day8.txt').toString();

    return raw.split('\n').filter(x => x);
};

const parseInstruction = line => {
    try {
        const match = line.match(/(\w*) (inc|dec) (\S*) if (\w*) (>|>=|<|<=|==|!=) (\S*)/);
        const [_, register, command, value, condRegister, cond, condValue] = match;

        return {
            register,
            command,
            value: +value,
            condRegister,
            cond,
            condValue: +condValue
        };
    } catch (err) {
        throw new Error(`Failed to parse instruction: ${line}\n${err.toString()}`);
    }
};

const commands = {
    'inc': (reg, val) => reg + val,
    'dec': (reg, val) => reg - val
};

const conditions = {
    '>': (reg, val) => reg > val,
    '>=': (reg, val) => reg >= val,
    '<': (reg, val) => reg < val,
    '<=': (reg, val) => reg <= val,
    '==': (reg, val) => reg == val,
    '!=': (reg, val) => reg != val
};

const evalCommand = (reg, inst) => {
    const command = commands[inst.command];

    return command(reg, inst.value);
};

const evalCondition = (reg, inst) => {
    const condition = conditions[inst.cond];

    return condition(reg, inst.condValue);
};

const evalInstruction = (regs, inst) => {
    const { register, condRegister } = inst;
    const registerVal = regs[register] || 0;
    const condRegisterVal = regs[condRegister] || 0;

    if (evalCondition(condRegisterVal, inst)) {
        regs[register] = evalCommand(registerVal, inst);
    }

    return regs[register];
};

const evalInstructions = (insts) => {
    const registers = {};

    insts.forEach(inst => evalInstruction(registers, inst));

    return registers;
};

const test1 = (insts) => {
    const registers = evalInstructions(insts);

    return Object.keys(registers)
        .reduce((max, r) => Math.max(max, registers[r]), Number.NEGATIVE_INFINITY);
}

const test2 = (insts) => {
    const registers = {};
    let max = Number.NEGATIVE_INFINITY;

    insts.forEach(inst => {
        let res = evalInstruction(registers, inst);
        max = Math.max(max, res);
    });

    return max;
}

console.log('Test 1:', test1(getInput().map(parseInstruction)));
console.log('Test 2:', test2(getInput().map(parseInstruction)));
