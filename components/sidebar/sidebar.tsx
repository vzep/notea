import SidebarTool from 'components/sidebar/sidebar-tool';
import SideBarList from 'components/sidebar/sidebar-list';
import UIState from 'libs/web/state/ui';
import { FC, useEffect, useCallback, useRef } from 'react';
import NoteTreeState from 'libs/web/state/tree';

interface SidebarProps {
    onHoverChange?: (hovered: boolean) => void;
}

const Sidebar: FC<SidebarProps> = ({ onHoverChange }) => {
    const { ua } = UIState.useContainer();
    const { initTree } = NoteTreeState.useContainer();

    useEffect(() => {
        initTree()?.catch((v) => console.error('Error whilst initialising tree: %O', v));
    }, [initTree]);

    return ua?.isMobileOnly ? <MobileSidebar /> : <BrowserSidebar onHoverChange={onHoverChange} />;
};

const BrowserSidebar: FC<SidebarProps> = ({ onHoverChange }) => {
    const {
        sidebar: { isFold, isHovered, setHovered, toggle },
        split: { sizes },
    } = UIState.useContainer();
    const sidebarRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = useCallback(() => {
        setHovered(true);
        onHoverChange?.(true);
    }, [setHovered, onHoverChange]);

    const handleMouseLeave = useCallback((e: React.MouseEvent) => {
        // 检查鼠标是否真的离开了侧边栏区域
        if (sidebarRef.current) {
            const rect = sidebarRef.current.getBoundingClientRect();
            const isOutside = 
                e.clientX < rect.left ||
                e.clientX > rect.right ||
                e.clientY < rect.top ||
                e.clientY > rect.bottom;

            if (isOutside) {
                setHovered(false);
                onHoverChange?.(false);
            }
        }
    }, [setHovered, onHoverChange]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        toggle();
    }, [toggle]);

    const shouldShow = isHovered || !isFold;

    return (
        <>
            {isFold && (
                <div 
                    className="fixed left-0 top-0 h-full z-10 bg-transparent hover:bg-gray-100/10"
                    style={{ width: '8px' }}
                    onMouseEnter={handleMouseEnter}
                />
            )}
            <section
                ref={sidebarRef}
                className="flex h-full fixed left-0 transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 shadow-lg"
                style={{
                    width: `${sizes[0]}px`,
                    transform: shouldShow ? 'translateX(0)' : 'translateX(-100%)',
                    pointerEvents: 'auto',
                    zIndex: 20
                }}
                onMouseLeave={handleMouseLeave}
            >
                <div className="flex h-full" onClick={handleClick}>
                    <SidebarTool />
                    <SideBarList />
                </div>
            </section>
        </>
    );
};

const MobileSidebar: FC = () => {
    return (
        <section className="flex h-full" style={{ width: '80vw' }}>
            <SidebarTool />
            <SideBarList />
        </section>
    );
};

export default Sidebar;
