// https://github.com/lucidrains/lambda-networks

import { tf, LayerArgs, Shape, Tensor } from '../tf';
import { conv2dLayer } from './conv2d';

export type LambdaLayerProps = LayerArgs & {
    dim_k: number;
    r: number;
    heads: number;
    dim_out: number;
    dim_u: number;
};

export class LambdaLayer extends tf.layers.Layer {
    out_dim: number;
    u: number;
    heads: number;
    dim_v: number;
    dim_k: number;
    to_q: tf.layers.Layer;
    to_k: tf.layers.Layer;
    to_v: tf.layers.Layer;
    norm_q: tf.layers.Layer;
    norm_v: tf.layers.Layer;
    pos_conv: tf.layers.Layer;

    constructor(config: LambdaLayerProps) {
        super(config);

        this.out_dim = config.dim_out;
        this.u = config.dim_u; // intra-depth dimension

        if (config.dim_out % config.heads !== 0) {
            throw new Error(
                'values dimension must be divisible by number of heads for multi-head query',
            );
        }
        this.dim_v = config.dim_out; // heads
        this.dim_k = config.dim_k;
        this.heads = config.heads;

        this.to_q = conv2dLayer(this.dim_k * this.heads, 1);
        this.to_k = conv2dLayer(this.dim_k * this.u, 1);
        this.to_v = conv2dLayer(this.dim_v * this.u, 1);

        this.norm_q = tf.layers.batchNormalization();
        this.norm_v = tf.layers.batchNormalization();

        if (config.r % 2 !== 1) {
            throw new Error('Receptive kernel size should be odd');
        }
        this.pos_conv = tf.layers.conv3d({
            filters: config.dim_k,
            kernelSize: [1, config.r, config.r],
            strides: 1,
            padding: 'same',
            activation: 'linear',
            useBias: true,
        });
    }

    /**
     * build() is called when the custom layer object is connected to an
     * upstream layer for the first time.
     * This is where the weights (if any) are created.
     */
    build(inputShape: Shape) {
        const [b, hh, ww] = inputShape;
        this.to_q.build(inputShape);
        this.to_k.build(inputShape);
        this.to_v.build(inputShape);
        this.norm_q.build([b, hh, ww, this.dim_k * this.heads]);
        this.norm_v.build([b, hh, ww, this.dim_v * this.u]);
        this.pos_conv.build([b, this.dim_v, hh, ww, this.u]);
    }

    /**
     * Counts the total number of numbers (e.g., float32, int32) in the
     * weights.
     */
    countParams() {
        return (
            this.to_q.countParams() +
            this.to_k.countParams() +
            this.to_v.countParams() +
            this.pos_conv.countParams()
        );
    }

    /**
     * Computes the output shape of the layer.
     */
    computeOutputShape(inputShape: Shape): Shape {
        const [b, hh, ww] = inputShape;

        return [b, hh, ww, this.heads * this.dim_v];
    }

    /**
     * call() contains the actual numerical computation of the layer.
     *
     * It is "tensor-in-tensor-out". I.e., it receives one or more
     * tensors as the input and should produce one or more tensors as
     * the return value.
     *
     * Be sure to use tidy() to avoid WebGL memory leak.
     */
    call([x]: Tensor[]) {
        return tf.tidy(() => {
            const [b, hh, ww, , u, h] = [...x.shape, this.u, this.heads];

            let q = this.to_q.apply(x);
            let k = this.to_k.apply(x) as Tensor;
            let v = this.to_v.apply(x);

            q = this.norm_q.apply(q) as Tensor;
            v = this.norm_v.apply(v) as Tensor;

            // b hh ww (h k) -> b h k (hh ww)
            q = q.reshape([b, h, this.dim_k, hh * ww]);
            // b hh ww (u k) -> b u k (hh ww)
            k = k.reshape([b, u, this.dim_k, hh * ww]);
            // b hh ww (u v) -> b u v (hh ww)
            v = v.reshape([b, u, this.dim_v, hh * ww]);

            k = tf.softmax(k);

            const Lc = tf.einsum('b u k m, b u v m -> b k v', k, v);
            const Yc = tf.einsum('b h k n, b k v -> b n h v', q, Lc);

            // local contexts
            // b u v (hh ww) -> b v hh ww u
            v = v.reshape([b, this.dim_v, hh, ww, u]);

            let Lp = this.pos_conv.apply(v) as Tensor;

            // b v h w k -> b v k (h w)
            Lp = Lp.reshape([b, this.dim_v, this.dim_k, hh * ww]);

            const Yp = tf.einsum('b h k n, b v k n -> b n h v', q, Lp);
            const Y = tf.add(Yc, Yp);

            // b (hh ww) h v -> b hh ww (h v)
            return Y.reshape([b, hh, ww, h * this.dim_v] as number[]);
        });
    }

    /**
     * getConfig() generates the JSON object that is used
     * when saving and loading the custom layer object.
     */
    getConfig() {
        const config = super.getConfig();
        Object.assign(config, {
            out_dim: this.out_dim,
            u: this.u,
            heads: this.heads,
            dim_v: this.dim_v,
            dim_k: this.dim_k,
        });
        return config;
    }

    /**
     * The static className getter is required by the
     * registration step (see below).
     */
    static get className() {
        return 'LambdaLayer';
    }
}

/**
 * Regsiter the custom layer, so TensorFlow.js knows what class constructor
 * to call when deserializing an saved instance of the custom layer.
 */
tf.serialization.registerClass(LambdaLayer);
