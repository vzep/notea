import SidebarTool from 'components/sidebar/sidebar-tool';
import SideBarList from 'components/sidebar/sidebar-list';
import UIState from 'libs/web/state/ui';
import { FC, useEffect } from 'react';
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
        sidebar: { isFold, isHovered, isPinned, setHovered, toggle },
        split: { sizes },
    } = UIState.useContainer();

    const handleMouseEnter = () => {
        setHovered(true);
        onHoverChange?.(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
        onHoverChange?.(false);
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggle();
    };

    const shouldShow = isHovered || isPinned || !isFold;
    const triggerWidth = 8;

    return (
        <>
            <div 
                className="fixed left-0 top-0 h-full z-10 bg-transparent"
                style={{ width: `${triggerWidth}px` }}
                onMouseEnter={handleMouseEnter}
            />
            <section
                className={`flex h-full fixed left-0 transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 shadow-lg`}
                style={{
                    width: `${sizes[0]}px`,
                    transform: shouldShow ? 'translateX(0)' : 'translateX(-100%)',
                    pointerEvents: 'auto',
                }}
                onMouseLeave={handleMouseLeave}
                onClick={handleToggle}
            >
                <div className="flex h-full">
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
