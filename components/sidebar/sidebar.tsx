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

    const [isHovered, setIsHovered] = useState(false);
    const [isPinned, setIsPinned] = useState(false);

    const handleMouseEnter = () => {
        if (!isPinned) {
            setIsHovered(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isPinned) {
            setIsHovered(false);
        }
    };

    const togglePin = () => {
        setIsPinned(!isPinned);
        if (!isPinned) {
            setIsHovered(false);
        }
    };

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
                {sidebar.isFold ? null : (
                    <div className="relative w-full">
                        <button
                            className="absolute right-2 top-2 p-2 rounded hover:bg-gray-200"
                            onClick={togglePin}
                        >
                            {isPinned ? (
                                <PinFilledIcon className="w-4 h-4" />
                            ) : (
                                <PinIcon className="w-4 h-4" />
                            )}
                        </button>
                        <SideBarList />
                    </div>
                )}
            </section>

            <style jsx>{`
                @keyframes slideIn {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); }
                    to { transform: translateX(-100%); }
                }
            `}</style>
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

// Pin 图标组件
const PinIcon: FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5h14m0 0v14m0-14l-14 14" />
    </svg>
);

const PinFilledIcon: FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 5h14v14L5 5z" />
    </svg>
);

export default Sidebar;
