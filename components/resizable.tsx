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
        sidebar: { isFold, isHovered },
    } = UIState.useContainer();
    const lastWidthRef = useRef(width);

    const defaultSizes: [number, number] = [20, 80];

    useEffect(() => {
        const lastWidth = lastWidthRef.current;

        if (width && lastWidth) {
            resize(lastWidth / width)
                ?.catch((v) => console.error('Error whilst resizing: %O', v));
        }
        lastWidthRef.current = width;
    }, [resize, width]);

    useEffect(() => {
        if (isFold && !isHovered) {
            splitRef.current?.split?.setSizes([0, 100]);
        } else {
            splitRef.current?.split?.setSizes(sizes || defaultSizes);
        }
    }, [isFold, isHovered, sizes]);

    const updateSplitSizes = useCallback(
        async (newSizes: [number, number]) => {
            if (isMobileOnly) {
                return;
            }
            
            if (!isFold || isHovered) {
                await saveSizes(newSizes);
            }
        },
        [saveSizes, isMobileOnly, isFold, isHovered]
    );

    return (
        <Split
            ref={splitRef}
            className="flex h-auto justify-end"
            minSize={[48, 200]}
            maxSize={[600, Infinity]}
            sizes={isFold && !isHovered ? [0, 100] : (sizes || defaultSizes)}
            gutterSize={5}
            gutter={renderGutter}
            onDragEnd={updateSplitSizes}
            snapOffset={0}
            style={{ transition: 'all 0.3s ease-in-out' }}
        >
            {children}
        </Split>
    );
};

export default Resizable;
