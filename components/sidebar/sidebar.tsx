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

const BrowserSidebar: FC<{ onHoverChange?: (hovered: boolean) => void }> = ({ onHoverChange }) => {
    const {
        split: { sizes },
    } = UIState.useContainer();
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
        onHoverChange?.(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        onHoverChange?.(false);
    };

    return (
        <>
            <div 
                className="fixed left-0 top-0 w-1 h-full z-10"
                onMouseEnter={handleMouseEnter}
            />
            <section
                className="flex h-full fixed left-0 transition-transform duration-300 ease-in-out"
                style={{
                    width: `calc(${sizes[0]}% - 5px)`,
                    transform: !isHovered ? 'translateX(-100%)' : 'translateX(0)',
                }}
                onMouseLeave={handleMouseLeave}
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
