import { LayerArgs, Shape, Tensor, tf } from '../tf';

export type TransposeProps = LayerArgs & {
    perm: number[];
};

export class Transpose extends tf.layers.Layer {
    perm: number[];

    constructor(config: TransposeProps) {
        super(config);

        this.perm = config.perm;
    }

    computeOutputShape(inputShape: Shape): Shape {
        const [b, ...rest] = inputShape;
        return [b, ...this.perm.map((index) => rest[index])];
    }

    call([x]: Tensor[]) {
        return tf.tidy(() => {
            const perm = [0, ...this.perm.map((index) => index + 1)];
            return tf.transpose(x as Tensor, perm);
        });
    }

    getConfig() {
        const config = super.getConfig();
        Object.assign(config, {
            perm: this.perm,
        });
        return config;
    }

    static get className() {
        return 'Transpose';
    }
}
