import { LayerArgs, Shape, Tensor, tf } from '../tf';

export type MultiHeadAttentionProps = LayerArgs & {
    heads: number;
    headDim: number;
    dropout: number;
};

export class MultiHeadAttention extends tf.layers.Layer {
    heads: number;
    headDim: number;
    dropout: number;
    innerDim: number;
    wq: tf.layers.Layer;
    wk: tf.layers.Layer;
    wv: tf.layers.Layer;
    dense: tf.layers.Layer;
    dropoutLayer: tf.layers.Layer;

    constructor(config: MultiHeadAttentionProps) {
        super(config);

        this.innerDim = config.headDim * config.heads;
        this.heads = config.heads;
        this.headDim = config.headDim;
        this.dropout = config.dropout;
        this.wq = tf.layers.dense({
            units: this.innerDim,
            activation: 'linear',
            useBias: false,
        });
        this.wk = tf.layers.dense({
            units: this.innerDim,
            activation: 'linear',
            useBias: false,
        });
        this.wv = tf.layers.dense({
            units: this.innerDim,
            activation: 'linear',
            useBias: false,
        });
        this.dense = tf.layers.dense({ units: this.innerDim, activation: 'linear' });
        this.dropoutLayer = tf.layers.dropout({ rate: config.dropout });
    }

    build(inputShapes: Shape[]) {
        const [queryShape, valueShape] = inputShapes;
        const outShape = [...queryShape.slice(2), this.innerDim];
        this.wq.build(queryShape);
        this.wk.build(valueShape);
        this.wv.build(valueShape);
        this.dense.build(outShape);
        this.dropoutLayer.build(outShape);
    }

    countParams() {
        return (
            this.wq.countParams() +
            this.wk.countParams() +
            this.wv.countParams() +
            this.dense.countParams() +
            this.dropoutLayer.countParams()
        );
    }

    computeOutputShape(inputShapes: Shape[]): Shape[] {
        const [queryShape] = inputShapes;
        const [b, s] = queryShape;
        return [
            [b, s, this.innerDim],
            [b, this.heads, s, s],
        ];
    }

    _splitHeads = (x: Tensor) => {
        const reshaped = tf.reshape(x, [
            x.shape[0],
            x.shape[1],
            this.heads,
            this.headDim,
        ]);
        return tf.transpose(reshaped, [0, 2, 1, 3]);
    };
    _concatHeads = (x: Tensor) => {
        const out = tf.transpose(x, [0, 2, 1, 3]);
        return tf.reshape(out, [out.shape[0], out.shape[1], this.innerDim]);
    };

    call(x: Tensor[]) {
        return tf.tidy(() => {
            const [query, value] = x;
            const q = this._splitHeads(this.wq.apply(query) as Tensor);
            const k = this._splitHeads(this.wk.apply(value) as Tensor);
            const v = this._splitHeads(this.wv.apply(value) as Tensor);

            const scale = Math.pow(this.headDim, -0.5);
            const sim = tf.matMul(q, k, false, true).mul(scale);
            const attnWeights = tf.softmax(sim, -1);
            const concatAttn = this._concatHeads(tf.matMul(attnWeights, v));

            let out = this.dense.apply(concatAttn);
            out = this.dropoutLayer.apply(out);

            return [out, attnWeights] as Tensor[];
        });
    }

    getConfig() {
        return {
            ...super.getConfig(),
            heads: this.heads,
            headDim: this.headDim,
            dropout: this.dropout,
        };
    }

    static get className() {
        return 'MultiHeadAttention';
    }
}
