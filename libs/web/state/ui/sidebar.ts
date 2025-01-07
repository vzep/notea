import useSettingsAPI from 'libs/web/api/settings';
import { isBoolean } from 'lodash';
import { useState, useCallback } from 'react';

export default function useSidebar(initState = false, isMobileOnly = false) {
    const [isFold, setIsFold] = useState(initState);
    const [isPinned, setIsPinned] = useState(false);
    const { mutate } = useSettingsAPI();

    const toggle = useCallback(
        async (state?: boolean) => {
            setIsFold((prev) => {
                const nextFold = isBoolean(state) ? state : !prev;
                if (!isMobileOnly) {
                    mutate({
                        sidebar_is_fold: nextFold,
                    });
                }
                return nextFold;
            });
        },
        [isMobileOnly, mutate]
    );

    const open = useCallback(() => {
        toggle(false).catch((v) =>
            console.error('Error whilst opening sidebar: %O', v)
        );
    }, [toggle]);

    const close = useCallback(() => {
        toggle(true).catch((v) =>
            console.error('Error whilst closing sidebar: %O', v)
        );
    }, [toggle]);

    // 新增 pinned 切换，假设用户选了 pin 也可以做一次 mutate 存储
    const togglePin = useCallback(() => {
        setIsPinned((prev) => {
            const nextState = !prev;
            // 也可以做和 sidebar_is_fold 同样的存储逻辑
            // mutate({ sidebar_is_pinned: nextState });
            return nextState;
        });
    }, []);
    
    return { isFold, toggle, open, close, isPinned, togglePin };
}
