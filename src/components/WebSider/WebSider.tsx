import React, { useState, useEffect }  from "react";
import { Layout as AntdLayout, Menu } from 'antd';
import { useNavigate } from "react-router-dom";
import type { MenuProps } from 'antd';
import { SearchOutlined, PlusCircleOutlined, SyncOutlined } from '@ant-design/icons';
import './WebSider.scss';

const { Sider } = AntdLayout;
type MenuItem = Required<MenuProps>['items'][number];

const WebSider: React.FC = () => {
    const navigate = useNavigate();
    const [currKey, setCurrKey] = useState("booklist");
    useEffect(() => {
        const pathSegment = window.location.pathname.split("/").filter(Boolean).pop()  || "booklist";;
        setCurrKey(pathSegment);
    });

    const menuItemsOfManager: MenuItem[] = [{
        key: "booklist",
        label: "書籍検索",
        icon: <SearchOutlined />
    }, {
        key: "createbook",
        label: "書籍追加",
        icon: <PlusCircleOutlined />
    }, {
        key: "3",
        label: "書籍返却",
        icon: <SyncOutlined />
    }];

    type ItemProps = {
        key: string;
        [key: string]: any;
    };

    const onMenuClick = (item: ItemProps) => navigate(`/${item.key}`);

    return (
        <Sider className="web-sider-container">
            <Menu
                mode="inline"
                selectedKeys={[currKey]}
                items={menuItemsOfManager}
                onClick={onMenuClick}
            />
        </Sider>
    )
}
export default WebSider;

