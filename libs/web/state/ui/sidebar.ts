import useSettingsAPI from 'libs/web/api/settings';
import { isBoolean } from 'lodash';
import { useState, useCallback } from 'react';


export default function useSidebar(initState = false, isMobileOnly = false) {  // 默认为折叠状态
    const [isFold, setIsFold] = useState(initState);
    const [isHovered, setIsHovered] = useState(false);
    const [isPinned, setIsPinned] = useState(false); // 新增固定状态
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
                
                // 当折叠时，取消固定状态
                if (nextIsFold) {
                    setIsPinned(false);
                }
                
                return nextIsFold;
            });
        },
        [isMobileOnly, mutate]
    );

    const setHovered = useCallback((state: boolean) => {
        if (!isPinned) { // 只在非固定状态下更新悬停状态
            setIsHovered(state);
        }
    }, [isPinned]);

    const togglePin = useCallback(() => {
        setIsPinned(prev => !prev);
    }, []);

    const open = useCallback(() => {
        toggle(false)?.catch((v) => console.error('Error whilst opening sidebar: %O', v));
    }, [toggle]);

    const close = useCallback(() => {
        toggle(true)?.catch((v) => console.error('Error whilst closing sidebar: %O', v));
    }, [toggle]);

    return { 
        isFold, 
        isHovered, 
        isPinned, 
        setHovered, 
        togglePin, 
        toggle, 
        open, 
        close 
    };
}
