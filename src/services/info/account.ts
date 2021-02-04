import { AccountDept, IAccountDept } from '../../models/account/dept';
import { AccountUser, IAccountUser } from '../../models/account/user';
import { AccountPreference, IAccountPreference } from '../../models/account/preference';

export default {
    dept: async (mediaId: number) => {
        const resultModels = await AccountDept.selectByMediaId(mediaId);
        const ret: IAccountDept[] = [];
        if (resultModels === null) return null;

        for (const model of resultModels) {
            ret.push(model.data);
        }
        return ret;
    },

    user: async (mediaId: number) => {
        const resultModels = await AccountUser.selectByMediaId(mediaId);
        const ret: IAccountUser[] = [];
        if (resultModels === null) return null;

        for (const model of resultModels) {
            ret.push(model.data);
        }
        return ret;
    },

    preference: async (mediaId: number) => {
        const ret = await AccountPreference.getByMediaId(mediaId);
        return ret ? ret.data : null;
    }
};