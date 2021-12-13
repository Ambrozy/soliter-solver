import { Tensor, SymbolicTensor } from '@tensorflow/tfjs';

export * as tf from '@tensorflow/tfjs';
export type { Shape, LayersModel, Rank, Tensor, Tensor1D, Tensor2D, Tensor3D } from '@tensorflow/tfjs';
export type ActivationIdentifier =
    | 'elu'
    | 'hardSigmoid'
    | 'linear'
    | 'relu'
    | 'relu6'
    | 'selu'
    | 'sigmoid'
    | 'softmax'
    | 'softplus'
    | 'softsign'
    | 'tanh'
    | 'swish'
    | 'mish';

export type LayerOutput = Tensor | Tensor[] | SymbolicTensor | SymbolicTensor[];
export type TrainLayerOutput = Tensor | Tensor[];
export type ContainerArgs = {
    inputs: SymbolicTensor | SymbolicTensor[];
    outputs: SymbolicTensor | SymbolicTensor[];
    name?: string;
};
