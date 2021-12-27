// https://github.com/rish-16/mlp-mixer-tf

import { LayerArgs, Shape, Tensor, tf } from '../tf';
import { MLP } from './MLP';

export type MixerLayerProps = LayerArgs & {
    hiddenDim: number;
    widthDim: number;
    heightDim: number;
};

export class MixerLayer extends tf.layers.Layer {
    hiddenDim: number;
    widthDim: number;
    heightDim: number;
    MLP1: tf.layers.Layer;
    MLP2: tf.layers.Layer;
    norm1: tf.layers.Layer;
    norm2: tf.layers.Layer;

    constructor(config: MixerLayerProps) {
        super(config);

        this.hiddenDim = config.hiddenDim;
        this.widthDim = config.widthDim;
        this.heightDim = config.heightDim;
        this.MLP1 = new MLP({
            hiddenDim: this.hiddenDim,
            outDim: this.widthDim,
        });
        this.MLP2 = new MLP({
            hiddenDim: this.hiddenDim,
            outDim: this.heightDim,
        });
        this.norm1 = tf.layers.layerNormalization();
        this.norm2 = tf.layers.layerNormalization();
    }

    build(inputShape: Shape) {
        const [w, h] = inputShape.slice(-2);
        this.norm1.build(inputShape);
        this.norm2.build(inputShape);
        this.MLP1.build([...inputShape.slice(0, -2), h, w]);
        this.MLP2.build(inputShape);
    }

    countParams() {
        return (
            this.MLP1.countParams() +
            this.MLP2.countParams() +
            this.norm1.countParams() +
            this.norm2.countParams()
        );
    }

    computeOutputShape(inputShape: Shape): Shape {
        return inputShape;
    }

    call(x: Tensor) {
        return tf.tidy(() => {
            let out1 = this.norm1.apply(x) as Tensor;
            out1 = tf.transpose(out1, [0, 1, 3, 2]);
            out1 = this.MLP1.apply(out1) as Tensor;
            out1 = tf.transpose(out1, [0, 1, 3, 2]);

            // console.log(out1.shape, (x as any)[0].shape);
            const in2 = out1; //.add(x);

            let out2 = this.norm2.apply(in2);
            out2 = this.MLP2.apply(out2) as Tensor;
            // out2 = out2.add(in2);

            return out2;
        });
    }

    getConfig() {
        const config = super.getConfig();
        Object.assign(config, {
            hiddenDim: this.hiddenDim,
            widthDim: this.widthDim,
            heightDim: this.heightDim,
        });
        return config;
    }

    static get className() {
        return 'MixerLayer';
    }
}
