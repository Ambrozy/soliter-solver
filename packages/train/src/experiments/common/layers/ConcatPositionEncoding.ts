import { LayerArgs, Shape, Tensor, tf } from '../tf';

export type ConcatPositionEncodingProps = LayerArgs & {
    dim: number;
};

const multiplyArray = (arr: number[]) => arr.reduce((a, b) => a * b, 1);

export class ConcatPositionEncoding extends tf.layers.Layer {
    dim: number;
    x: tf.LayerVariable;

    constructor(config: ConcatPositionEncodingProps) {
        super(config);

        this.dim = config.dim;
    }

    build(inputShape: Shape) {
        const inputSize = multiplyArray(inputShape.slice(1, -1));
        this.x = this.addWeight(
            'x',
            [inputSize, this.dim],
            'float32',
            tf.initializers.ones(),
        );
    }

    countParams() {
        return multiplyArray(this.x.shape);
    }

    computeOutputShape(inputShape: Shape): Shape {
        const outShape = [inputShape[0], ...this.x.shape];
        outShape[outShape.length - 1] = inputShape.at(-1) + this.x.shape.at(-1);
        return outShape;
    }

    call(x: Tensor) {
        return tf.tidy(() => {
            const inX = Array.isArray(x) ? x[0] : x;
            const [b] = inX.shape;
            let position = tf.expandDims(this.x.read(), 0);
            position = position.tile([b, ...this.x.shape.map(() => 1)]);

            const flatten = inX.reshape([b, -1, inX.shape.at(-1)]);

            return flatten.concat(position, -1);
        });
    }

    getConfig() {
        return {
            ...super.getConfig(),
            dim: this.dim,
        };
    }

    static get className() {
        return 'ConcatPositionEncoding';
    }
}
