import { LayerArgs, Shape, Tensor, tf } from '../tf';
import { MultiHeadAttention } from './MultiHeadAttention';

export type TransformerProps = LayerArgs & {
    heads: number;
    headDim: number;
    denseDim: number;
    attentionDropout: number;
    denseDropout: number;
};

export class Transformer extends tf.layers.Layer {
    heads: number;
    headDim: number;
    denseDim: number;
    attentionDropout: number;
    denseDropout: number;
    attention: tf.layers.Layer;
    dense: tf.layers.Layer;
    dropoutDenseLayer: tf.layers.Layer;
    norm1: tf.layers.Layer;
    norm2: tf.layers.Layer;

    constructor(config: TransformerProps) {
        super(config);

        this.heads = config.heads;
        this.headDim = config.headDim;
        this.denseDim = config.denseDim;
        this.attentionDropout = config.attentionDropout;
        this.denseDropout = config.denseDropout;
        this.attention = new MultiHeadAttention({
            heads: this.heads,
            headDim: this.headDim,
            dropout: this.attentionDropout,
        });
        this.dense = tf.layers.dense({ units: this.denseDim, activation: 'relu' });
        this.dropoutDenseLayer = tf.layers.dropout({ rate: this.denseDropout });
        this.norm1 = tf.layers.layerNormalization({ axis: -1 });
        this.norm2 = tf.layers.layerNormalization({ axis: -1 });
    }

    build(inputShapes: Shape[]) {
        const [queryShape, valueShape] = inputShapes;
        const denseShape = [...queryShape.slice(0, 2), this.heads * this.headDim];
        const dropoutShape = [...queryShape.slice(0, 2), this.denseDim];
        this.attention.build([queryShape, valueShape]);
        this.norm1.build(denseShape);
        this.dense.build(denseShape);
        this.dropoutDenseLayer.build(dropoutShape);
        this.norm2.build(dropoutShape);
    }

    countParams() {
        return (
            this.attention.countParams() +
            this.norm1.countParams() +
            this.dense.countParams() +
            this.dropoutDenseLayer.countParams() +
            this.norm2.countParams()
        );
    }

    computeOutputShape(inputShapes: Shape[]): Shape[] {
        const [queryShape] = inputShapes;
        const [b, s] = queryShape;
        return [
            [b, s, this.denseDim],
            [b, this.heads, s, s],
        ];
    }

    call(x: Tensor[]) {
        return tf.tidy(() => {
            const [attn, attnWeights] = this.attention.apply(x) as Tensor[];
            const normedAttn = this.norm1.apply(attn);

            let out = this.dense.apply(normedAttn);
            out = this.dropoutDenseLayer.apply(out);
            out = this.norm2.apply(out);

            return [out, attnWeights] as Tensor[];
        });
    }

    getConfig() {
        return {
            ...super.getConfig(),
            heads: this.heads,
            headDim: this.headDim,
            denseDim: this.denseDim,
            attentionDropout: this.attentionDropout,
            denseDropout: this.denseDropout,
        };
    }

    static get className() {
        return 'Transformer';
    }
}
