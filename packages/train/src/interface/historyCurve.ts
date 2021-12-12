import flatten from 'lodash/flatten';

const canvas = document.getElementById('curve') as HTMLCanvasElement;
const context = canvas.getContext('2d');
const colors = ['red', 'blue', 'orange', 'green', 'purple', 'aqua'];
const axisValueOffset = 20;
const backgroundColor = 'white';

canvas.width = 400 + axisValueOffset;
canvas.height = 200 + axisValueOffset;

const drawLine = (points: [number, number][], color: string) => {
    context.beginPath();
    points.map((data, index) => {
        index === 0 ? context.moveTo(data[0], data[1]) : context.lineTo(data[0], data[1]);
    });
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.stroke();
};

const drawText = (
    text: string,
    position: [number, number],
    fontSize: number,
    color: string,
    textAlign: CanvasTextAlign = 'center',
) => {
    context.font = `${fontSize}px Arial`;
    context.textAlign = textAlign;
    context.fillStyle = color;
    context.fillText(text, position[0], position[1] + fontSize / 4);
};

const drawCircle = (position: [number, number], radius: number, color: string) => {
    context.beginPath();
    context.arc(position[0], position[1], radius, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
};

const drawRect = (position1: [number, number], position2: [number, number], color: string) => {
    context.fillStyle = color;
    context.fillRect(position1[0], position1[1], position2[0], position2[1]);
};

export const drawHistory = (log: Record<string, number[]>) => {
    const logValues = Object.values(log);
    const xStep = (canvas.width - axisValueOffset) / logValues[0].length;
    const flatValues = flatten(logValues);
    const maxValue = Math.max(...flatValues);
    const expMaxValue = maxValue.toExponential();
    const exponent = Number(expMaxValue.slice(expMaxValue.indexOf('e') + 1));
    const yMultiplier = Math.pow(10, -exponent);
    const maxYLineValue = Math.ceil(maxValue * yMultiplier);
    const endYMultiplier = maxYLineValue < 3 ? yMultiplier * 10 : yMultiplier;
    const endMaxYLineValue = Math.ceil(maxValue * endYMultiplier);
    const yStep = (canvas.height - axisValueOffset) / endMaxYLineValue;
    const isExponentialValuesPrint = maxValue > 100 || maxValue < 0.01;
    const getXPosition = (x: number) => axisValueOffset + x * xStep;
    const getYPosition = (y: number) => canvas.height - axisValueOffset - y * yStep;
    const getColorByIndex = (index: number) => colors[(colors.length - 1) % (index + 1)];

    // clear
    drawRect([0, 0], [canvas.width, canvas.height], backgroundColor);

    // Oy
    logValues[0].forEach((_, index) => {
        drawLine(
            [
                [getXPosition(index), getYPosition(0) + 3],
                [getXPosition(index), getYPosition(endMaxYLineValue)],
            ],
            '#000',
        );
        drawText(String(index), [getXPosition(index), canvas.height - axisValueOffset / 2], 9, '#000');
    });

    // Ox
    Array.from({ length: endMaxYLineValue }).forEach((_, index) => {
        const yValue = index / endYMultiplier;
        const strYValue = isExponentialValuesPrint ? yValue.toExponential() : String(yValue);

        drawLine(
            [
                [getXPosition(0) - 3, getYPosition(index)],
                [getXPosition(logValues[0].length - 1), getYPosition(index)],
            ],
            '#000',
        );
        drawText(strYValue, [2, getYPosition(index)], 9, '#000', 'left');
    });

    // curve
    Object.values(log).forEach((data, index) => {
        context.beginPath();
        data.map((value, epoch) => {
            epoch === 0
                ? context.moveTo(getXPosition(epoch), getYPosition(value * endYMultiplier))
                : context.lineTo(getXPosition(epoch), getYPosition(value * endYMultiplier));
        });
        context.lineWidth = 1;
        context.strokeStyle = getColorByIndex(index);
        context.stroke();
    });

    // legend
    const logNames = Object.keys(log);
    const fontSize = 9;
    const lineHeight = fontSize * 1.2;
    const radius = 3;

    drawRect([2 + axisValueOffset, 0], [100, (logNames.length + 1) * lineHeight], backgroundColor);
    logNames.forEach((name, index) => {
        const color = getColorByIndex(index);

        drawCircle([7 + axisValueOffset, (index + 1) * lineHeight - radius / 2], radius, color);
        drawText(name, [9 + radius * 2 + axisValueOffset, (index + 1) * lineHeight], fontSize, color, 'left');
    });
};
