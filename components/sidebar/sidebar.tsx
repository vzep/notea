import SidebarTool from 'components/sidebar/sidebar-tool';
import SideBarList from 'components/sidebar/sidebar-list';
import UIState from 'libs/web/state/ui';
import { FC, useEffect, useState } from 'react';
import NoteTreeState from 'libs/web/state/tree';

const Sidebar: FC = () => {
    const { ua } = UIState.useContainer();
    const { initTree } = NoteTreeState.useContainer();

    useEffect(() => {
        initTree()?.catch((v) =>
            console.error('Error whilst initialising tree: %O', v)
        );
    }, [initTree]);

    return ua?.isMobileOnly ? <MobileSidebar /> : <BrowserSidebar />;
};

const BrowserSidebar: FC = () => {
    const {
        sidebar,
        split: { sizes },
    } = UIState.useContainer();
    const [hovered, setHovered] = useState(false);

    // 未折叠时侧边栏的正常宽度
    const expandWidth = `calc(${sizes[0]}% - 5px)`;

    /**
     * 当用户“折叠”时 => 通过 hovered 来判断是否悬浮展开
     * 当用户“未折叠”时 => 一直显示正常宽度
     */
    const containerWidth = sidebar.isFold
        ? hovered
            ? expandWidth
            : '0px'
        : expandWidth;

    return (
        <>
            {/* 
                只有在折叠时才显示“唤醒区域”：
                一个固定在左侧、很窄的 div，用于捕捉鼠标悬浮。
                注意 z-index 要大一点，确保它能接收鼠标事件。
            */}
            {sidebar.isFold && (
                <div
                    className="fixed top-0 left-0 h-full"
                    style={{
                        width: '8px',        // 可自行调整唤醒区域的宽度
                        zIndex: 50,          // 使之在侧边栏之上，能接收鼠标
                        cursor: 'pointer',   // 鼠标样式
                    }}
                    onMouseEnter={() => setHovered(true)}
                />
            )}

            <section
                className="flex h-full fixed left-0 transition-all duration-300 ease-in-out overflow-hidden bg-white"
                style={{
                    width: containerWidth,
                    zIndex: 40,
                }}
                // 鼠标从该区域离开时，如果是折叠状态，就自动隐藏
                onMouseLeave={() => {
                    if (sidebar.isFold) {
                        setHovered(false);
                    }
                }}
            >
                {/**
                 * 当折叠但 hovered=true, 或者没折叠时 => 显示工具栏+列表
                 * 否则就完全不渲染它们（实现“整个侧边栏都隐藏”效果）。
                 */}
                {(!sidebar.isFold || hovered) && (
                    <>
                        <SidebarTool />
                        <SideBarList />
                    </>
                )}
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
