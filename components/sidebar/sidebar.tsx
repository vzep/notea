import SidebarTool from 'components/sidebar/sidebar-tool';
import SideBarList from 'components/sidebar/sidebar-list';
import UIState from 'libs/web/state/ui';
import { FC, useEffect, useState } from 'react';
import NoteTreeState from 'libs/web/state/tree';

const Sidebar: FC = () => {
    const { ua } = UIState.useContainer();
    const { initTree } = NoteTreeState.useContainer();

    useEffect(() => {
        initTree()?.catch((v) => console.error('Error whilst initialising tree: %O', v));
    }, [initTree]);

    return ua?.isMobileOnly ? <MobileSidebar /> : <BrowserSidebar />;
};

const BrowserSidebar: FC = () => {
    const {
        sidebar,
        split: { sizes },
    } = UIState.useContainer();
    const [isHovered, setIsHovered] = useState(false);

    const sidebarWidth = `calc(${sizes[0]}% - 5px)`;
    const toolbarWidth = '40px';  // SidebarTool 的宽度

    return (
        <section
            className="flex h-full fixed left-0 transition-transform duration-300 ease-in-out"
            style={{
                width: sidebarWidth,
                transform: (!isHovered && sidebar.isFold) ? `translateX(calc(-${sidebarWidth} + ${toolbarWidth}))` : 'translateX(0)',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex h-full">
                <SidebarTool />
                <div 
                    className="transition-opacity duration-300"
                    style={{
                        opacity: (!isHovered && sidebar.isFold) ? 0 : 1,
                        visibility: (!isHovered && sidebar.isFold) ? 'hidden' : 'visible',
                    }}
                >
                    <SideBarList />
                </div>
            </div>
            <style jsx>{`
                section {
                    will-change: transform;
                }
            `}</style>
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
