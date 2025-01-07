import useSettingsAPI from 'libs/web/api/settings';
import { isBoolean } from 'lodash';
import { useState, useCallback } from 'react';


export default function useSidebar(initState = false, isMobileOnly = false) {  // 默认为折叠状态
    const [isFold, setIsFold] = useState(initState);
    const [isHovered, setIsHovered] = useState(false); // 新增悬停状态
    const { mutate } = useSettingsAPI();

    const toggle = useCallback(
        async (state?: boolean) => {
            setIsFold((prev) => {
                const nextIsFold = isBoolean(state) ? state : !prev;

                if (!isMobileOnly) {
                    mutate({
                        sidebar_is_fold: nextIsFold,
                    });
                }

                return nextIsFold;
            });
        },
        [isMobileOnly, mutate]
    );

    const setHovered = useCallback((state: boolean) => {
        setIsHovered(state);
    }, []);

    const open = useCallback(() => {
        toggle(false)?.catch((v) => console.error('Error whilst opening sidebar: %O', v));
    }, [toggle]);

    const close = useCallback(() => {
        toggle(true)?.catch((v) => console.error('Error whilst closing sidebar: %O', v));
    }, [toggle]);

    return { isFold, isHovered, setHovered, toggle, open, close };
}
