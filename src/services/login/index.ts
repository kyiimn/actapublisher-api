import { Request } from '../session';
import { AccountDept } from '../../models/account/dept';
import { AccountUser } from '../../models/account/user';

export default {
    getLoginInfo: async (req: Request) => {
        if (!req.session?.logined && true) {
            if (!req.session) req.session = {};
            req.session.logined = true;
            req.session.userId = 1;
            req.session.deptId = 1;
            req.session.mediaId = 1;
            req.session.deptName = '개발부';
            req.session.userName = '김김';
            req.session.level = 1;
            req.session.rule = 1;
        };
        const dept = req.session.deptId ? await AccountDept.get(req.session.deptId) : null;
        const user = req.session.userId ? await AccountUser.getById(req.session.userId) : null;

        return {
            logined: req.session.logined,
            mediaId: req.session.mediaId,
            dept: dept ? dept.data : null,
            user: user ? user.data : null
        };
    }
};