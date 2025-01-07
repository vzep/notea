import UIState from 'libs/web/state/ui';
import Split from 'react-split';
import { FC, useCallback, useEffect, useRef } from 'react';
import { ReactNodeLike } from 'prop-types';

const renderGutter = () => {
    const gutter = document.createElement('div');
    const line = document.createElement('div');

    gutter.className = 'gutter group cursor-col-resize z-20';
    line.className =
        'transition-colors delay-150 group-hover:bg-gray-300 dark:group-hover:bg-gray-500 w-1 h-full';
    gutter.appendChild(line);

    return gutter;
};

const Resizable: FC<{ width: number; children: ReactNodeLike }> = ({
    width,
    children,
}) => {
    const splitRef = useRef<typeof Split>(null);
    const {
        split: { saveSizes, resize, sizes },
        ua: { isMobileOnly },
        sidebar: { isFold },
    } = UIState.useContainer();
    const lastWidthRef = useRef(width);

    useEffect(() => {
        const lastWidth = lastWidthRef.current;

        if (width && lastWidth) {
            resize(lastWidth / width)
                ?.catch((v) => console.error('Error whilst resizing: %O', v));
        }
        lastWidthRef.current = width;
    }, [resize, width]);

    // 处理折叠状态
    useEffect(() => {
        if (isFold) {
            splitRef.current?.split?.collapse(0);
        } else {
            // 恢复到上一次保存的尺寸
            splitRef.current?.split?.setSizes(sizes);
        }
    }, [isFold, sizes]);

    const updateSplitSizes = useCallback(
        async (newSizes: [number, number]) => {
            if (isMobileOnly) {
                return;
            }
            
            // 只有在非折叠状态下才保存尺寸
            if (!isFold) {
                await saveSizes(newSizes);
            }
        },
        [saveSizes, isMobileOnly, isFold]
    );

    return (
        <Split
            ref={splitRef}
            className="flex h-auto justify-end"
            minSize={[48, 200]} // 设置最小尺寸
            maxSize={[600, Infinity]} // 设置最大尺寸
            sizes={isFold ? [0, 100] : sizes} // 根据折叠状态动态设置尺寸
            gutterSize={5}
            gutter={renderGutter}
            onDragEnd={updateSplitSizes}
            snapOffset={0}
            style={{
                transition: 'all 0.3s ease-in-out',
            }}
        >
            {children}
        </Split>
    );
};

export default Resizable;
