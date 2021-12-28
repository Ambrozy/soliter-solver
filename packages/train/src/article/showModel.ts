import * as tfvis from '@tensorflow/tfjs-vis';
import { LayersModel } from '../experiments/common/tf';

export async function showModel(model: LayersModel) {
    const surface = {
        name: 'Model Summary',
        tab: 'Model',
    };
    await tfvis.show.modelSummary(surface, model);
}
