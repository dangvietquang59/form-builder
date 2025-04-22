import { BaseData } from '@/lib/baseData';
import { fetcher } from '@/lib/fetcher';
import urls from '@/utils/constants/urls';
import { FormTypeType } from '@/utils/types/formTypeType';

const formTypeApis = {
    async getAll() {
        try {
            const res = await fetcher<BaseData<FormTypeType>>({
                endpoint: `${urls.FORM}/${urls.TYPE}/${urls.LIST}`,
                method: 'GET',
            });
            return res;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
};
export default formTypeApis;
