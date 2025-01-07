import SidebarTool from 'components/sidebar/sidebar-tool';
import SideBarList from 'components/sidebar/sidebar-list';
import UIState from 'libs/web/state/ui';
import { FC, useEffect, useState } from 'react';
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
        sidebar,
        split: { sizes },
    } = UIState.useContainer();

    // 用于控制鼠标悬浮后自动展开
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

    // 原有可拖拽设置里的“展开”宽度
    const expandWidth = `calc(${sizes[0]}% - 5px)`;
    // 折叠后的最小宽度（可根据实际需要微调，让唤醒区域别太窄）
    const foldWidth = '48px';

    /**
     * 如果用户“没有折叠” => 一直按展开宽度来
     * 如果用户“折叠了”   => 悬浮时展开，否则显示最小宽度
     */
    const containerWidth = !sidebar.isFold
        ? expandWidth
        : hovered
        ? expandWidth
        : foldWidth;

    return (
        <section
            className="flex h-full fixed left-0 transition-all duration-300 ease-in-out overflow-hidden"
            style={{
                width: containerWidth,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* SidebarTool 部分一直显示 */}
            <SidebarTool />

            {/** 当没有折叠 或 鼠标悬浮时，显示 SideBarList */}
            {(!sidebar.isFold || hovered) && <SideBarList />}
        </section>
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
