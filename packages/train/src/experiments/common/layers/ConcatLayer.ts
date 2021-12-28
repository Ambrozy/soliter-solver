import { tf, Shape, Tensor } from '../tf';

export class ConcatLayer extends tf.layers.Layer {
    /**
     * Computes the output shape of the layer.
     */
    computeOutputShape(inputShape: Shape[]): Shape {
        const [layoutShape, binShape, stepsShape] = inputShape;
        const [b, hh, ww, c] = layoutShape;
        const [, binC] = binShape;
        const [, stepsC] = stepsShape;

        return [b, hh, ww, c + binC + stepsC];
    }

    /**
     * This is where the layer's logic lives.
     */
    call(x: Tensor[]) {
        return tf.tidy(() => {
            const [layout, bin, steps] = x;
            const [b, hh, ww] = layout.shape;
            const concatBin = bin.reshape([b, 1, 1, -1]).tile([1, hh, ww, 1]);
            const concatSteps = steps.reshape([b, 1, 1, -1]).tile([1, hh, ww, 1]);

            return tf.concat([layout, concatBin, concatSteps], -1);
        });
    }

    /**
     * The static className getter is required by the
     * registration step (see below).
     */
    static get className() {
        return 'ConcatLayer';
    }
}

/**
 * Regsiter the custom layer, so TensorFlow.js knows what class constructor
 * to call when deserializing an saved instance of the custom layer.
 */
tf.serialization.registerClass(ConcatLayer);
