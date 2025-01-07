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

    // “展开”时的宽度，来自 split.sizes[0]
    const expandWidth = `calc(${sizes[0]}% - 5px)`;
    // 如果是折叠状态，就将宽度设为0，否则使用正常宽度
    const containerWidth = sidebar.isFold ? '0px' : expandWidth;

    return (
        <section
            className="flex h-full fixed left-0 transition-all duration-300 ease-in-out overflow-hidden"
            style={{
                width: containerWidth,
            }}
        >
            {/**
             * 如果折叠就不渲染内容（整个 Sidebar 都隐藏），
             * 若未折叠，则显示工具栏和列表
             */}
            {sidebar.isFold ? null : (
                <>
                    <SidebarTool />
                    <SideBarList />
                </>
            )}
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
