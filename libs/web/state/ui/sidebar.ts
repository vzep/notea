import useSettingsAPI from 'libs/web/api/settings';
import { isBoolean } from 'lodash';
import { useState, useCallback } from 'react';

export default function useSidebar(initState = true, isMobileOnly = false) {  // 默认设置为折叠状态
    const [isFold, setIsFold] = useState(initState);
    const { mutate } = useSettingsAPI();

    const toggle = useCallback(
        async (state?: boolean) => {
            setIsFold((prev) => {
                const isFold = isBoolean(state) ? state : !prev;

                if (!isMobileOnly) {
                    mutate({
                        sidebar_is_fold: isFold,
                    });
                }

                return isFold;
            });
        },
        [isMobileOnly, mutate]
    );

    const open = useCallback(() => {
        toggle(false)?.catch((v) => console.error('Error whilst opening sidebar: %O', v));
    }, [toggle]);

    const close = useCallback(() => {
        toggle(true)?.catch((v) => console.error('Error whilst closing sidebar: %O', v));
    }, [toggle]);

    return { isFold, toggle, open, close };
}
