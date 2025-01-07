import useSettingsAPI from 'libs/web/api/settings';
import { isBoolean } from 'lodash';
import { useState, useCallback } from 'react';

export default function useSidebar(initState = false, isMobileOnly = false) {
    const [isFold, setIsFold] = useState(initState);
    const [isHovered, setIsHovered] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
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
        toggle(true)
            ?.catch((v) => console.error('Error whilst opening sidebar: %O', v));
    }, [toggle]);

    const close = useCallback(() => {
        toggle(false)
            ?.catch((v) => console.error('Error whilst closing sidebar: %O', v));
    }, [toggle]);

    const handleMouseEnter = useCallback(() => {
        if (!isPinned) {
            setIsHovered(true);
        }
    }, [isPinned]);

    const handleMouseLeave = useCallback(() => {
        if (!isPinned) {
            setIsHovered(false);
        }
    }, [isPinned]);

    const togglePin = useCallback(() => {
        setIsPinned((prev) => {
            const newPinned = !prev;
            if (!newPinned) {
                setIsHovered(false);
            }
            return newPinned;
        });
    }, []);
    
    return {
        isFold,
        isHovered,
        isPinned,
        toggle,
        open,
        close,
        handleMouseEnter,
        handleMouseLeave,
        togglePin,
    };
}
