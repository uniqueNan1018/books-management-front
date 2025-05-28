import React, { Children } from "react";
import { Layout as AntdLayout, Menu } from 'antd';
import WebHeader from "../WebHeader";
import WebSider from "../WebSider"
import { useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import './Layout.scss';

const { Header, Footer, Sider, Content } = AntdLayout;
type LayoutProps = React.PropsWithChildren<{}>;

const Layout: React.FC<LayoutProps> = (props = {}) => {
    const { children } = props;
    const {isLoggedIn} = useSelector((state: RootState) => state.user);
    return (
        <AntdLayout className="web-container">
            <WebHeader />
            <AntdLayout className="main-container">
                {isLoggedIn && <WebSider />}
                <Content className="main-container-wapper">
                    {children}
                </Content>
            </AntdLayout>
        </AntdLayout>
    )
}
export default Layout;