// https://github.com/rish-16/mlp-mixer-tf

import { LayerArgs, Shape, Tensor, tf } from '../tf';

export type MLPLayerProps = LayerArgs & {
    hiddenDim: number;
    outDim: number;
};

export class MLP extends tf.layers.Layer {
    hiddenDim: number;
    outDim: number;
    inDense: tf.layers.Layer;
    outDense: tf.layers.Layer;

    constructor(config: MLPLayerProps) {
        super(config);

        this.hiddenDim = config.hiddenDim;
        this.outDim = config.outDim;
        this.inDense = tf.layers.dense({ units: this.hiddenDim, activation: 'linear' });
        this.outDense = tf.layers.dense({ units: this.outDim, activation: 'linear' });
    }

    build(inputShape: Shape) {
        const innerShape = [...inputShape.slice(0, -1), this.hiddenDim];
        this.inDense.build(inputShape);
        this.outDense.build(innerShape);
    }

    countParams() {
        return this.inDense.countParams() + this.outDense.countParams();
    }

    computeOutputShape(inputShape: Shape): Shape {
        return [...inputShape.slice(0, -1), this.outDim];
    }

    call(x: Tensor) {
        return tf.tidy(() => {
            let out = this.inDense.apply(x);
            out = tf.layers.activation({ activation: 'elu' }).apply(out);
            out = this.outDense.apply(out);

            return out as Tensor;
        });
    }

    getConfig() {
        const config = super.getConfig();
        Object.assign(config, {
            hiddenDim: this.hiddenDim,
            outDim: this.outDim,
        });
        return config;
    }

    static get className() {
        return 'MLP';
    }
}
