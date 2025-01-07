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
        sidebar,
        split: { sizes },
    } = UIState.useContainer();

    const { isFold, isPinned, open, close } = sidebar;

    return (
        // 当 sidebar 折叠且未 pin 时，默认使用 -translate-x-full 隐藏，
        // 悬停（鼠标移入）后执行 open() 展开
        // 如果 pinned，则一直展开
        <section
            className={`
                flex h-full fixed left-0
                transition-transform duration-300
                ${isFold && !isPinned ? '-translate-x-full' : 'translate-x-0'}
            `}
            style={{
                width: `calc(${sizes[0]}% - 5px)`,
            }}
            onMouseEnter={() => {
                // 如果没被 pin，鼠标进来就自动展开
                if (!isPinned && isFold) {
                    open();
                }
            }}
            onMouseLeave={() => {
                // 如果没被 pin，鼠标离开就自动折叠
                if (!isPinned && !isFold) {
                    close();
                }
            }}
        >
            <SidebarTool />
            {isFold ? null : <SideBarList />}
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
