import { AccountDept, IAccountDept } from '../../models/account/dept';
import { AccountUser, IAccountUser } from '../../models/account/user';

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
    }
};