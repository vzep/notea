import SidebarTool from 'components/sidebar/sidebar-tool';
import SideBarList from 'components/sidebar/sidebar-list';
import UIState from 'libs/web/state/ui';
import { FC, useEffect } from 'react';
import NoteTreeState from 'libs/web/state/tree';

const Sidebar: FC = () => {
    const { ua } = UIState.useContainer();
    const { initTree } = NoteTreeState.useContainer();

    useEffect(() => {
        initTree()
            ?.catch((v) => console.error('Error whilst initialising tree: %O', v));
    }, [initTree]);

    return ua?.isMobileOnly ? <MobileSidebar /> : <BrowserSidebar />;
};

const BrowserSidebar: FC = () => {
    const {
        sidebar: { isHovered, isPinned, handleMouseEnter, handleMouseLeave, togglePin },
        split: { sizes },
    } = UIState.useContainer();

    return (
        <>
            {/* 悬浮触发区域 */}
            <div
                className="fixed left-0 top-0 w-2 h-full z-10"
                onMouseEnter={handleMouseEnter}
            />
            
            {/* 主侧边栏 */}
            <section
                className={`flex h-full fixed left-0 transition-transform duration-300 ${
                    !isPinned && !isHovered ? '-translate-x-full' : 'translate-x-0'
                }`}
                style={{
                    width: `calc(${sizes[0]}% - 5px)`,
                }}
                onMouseLeave={handleMouseLeave}
            >
                <SidebarTool />
                <div className="relative w-full">
                    <button
                        className="absolute right-2 top-2 p-2 rounded hover:bg-gray-200"
                        onClick={togglePin}
                    >
                        {/* 使用你项目中已有的图标系统 */}
                        {isPinned ? "取消固定" : "固定"}
                    </button>
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
