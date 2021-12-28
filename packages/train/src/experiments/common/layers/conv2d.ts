import { tf } from '../tf';

export const conv2dLayer = (
    numChannels: number,
    kernelSize: number,
    stride = 1,
    useBias = false,
) =>
    tf.layers.conv2d({
        filters: numChannels,
        kernelSize,
        strides: stride,
        padding: 'valid',
        activation: 'linear',
        useBias,
    });
