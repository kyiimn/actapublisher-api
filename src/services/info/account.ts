import { AccountDept, IAccountDept } from '../../models/account/dept';
import { AccountUser, IAccountUser } from '../../models/account/user';

export default {
    dept: async (mediaId: number) => {
        const resultModel = await AccountDept.selectByMediaId(mediaId);
        const ret: IAccountDept[] = [];
        if (!resultModel) return null;

        for (const model of resultModel) {
            ret.push(model.data);
        }
        return ret;
    },

    user: async (mediaId: number) => {
        const resultModel = await AccountUser.selectByMediaId(mediaId);
        const ret: IAccountUser[] = [];
        if (!resultModel) return null;

        for (const model of resultModel) {
            ret.push(model.data);
        }
        return ret;
    }
};