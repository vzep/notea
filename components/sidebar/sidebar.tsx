import SidebarTool from 'components/sidebar/sidebar-tool';
import SideBarList from 'components/sidebar/sidebar-list';
import UIState from 'libs/web/state/ui';
import { FC, useEffect, useState } from 'react';
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
        sidebar: { isFold },
        split: { sizes },
    } = UIState.useContainer();
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        if (isFold) {
            setIsHovered(true);
            onHoverChange?.(true);
        }
    };

    const handleMouseLeave = () => {
        if (isFold) {
            setIsHovered(false);
            onHoverChange?.(false);
        }
    };

    // 将点击事件绑定到整个侧边栏区域
    const handleClick = (e: React.MouseEvent) => {
        // 阻止事件冒泡
        e.stopPropagation();
    };

    return (
        <>
            {/* 触发区只在折叠状态显示 */}
            {isFold && (
                <div 
                    className="fixed left-0 top-0 w-1 h-full z-10"
                    onMouseEnter={handleMouseEnter}
                />
            )}
            <section
                className="flex h-full fixed left-0 transition-transform duration-300 ease-in-out"
                style={{
                    width: `calc(${sizes[0]}% - 5px)`,
                    transform: (!isHovered && isFold) ? 'translateX(-100%)' : 'translateX(0)',
                    pointerEvents: 'auto',
                }}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
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
