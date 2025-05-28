import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout as AntdLayout } from 'antd';
import './WebHeader.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { login, logout } from '../../stores/userSlice';

const { Header } = AntdLayout;

const WebHeader: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userInfos = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        const userinfosStr: string | null = sessionStorage.getItem("userinfos");
        if (userinfosStr !== null) {
            const userinfos = JSON.parse(userinfosStr);
            dispatch(login({
                name: userinfos.username,
                isManager: userinfos.role === 1,
            }));
        }
    });

    const onLogout = () => {
        sessionStorage.removeItem("userinfos");
        dispatch(logout());
        navigate("/login");
    }

    const renderMian = () => {
        return (
            <div className="main-wrapper">
                <img src="https://thaka.bing.com/th/id/ODLS.3c3ee6db-7809-46fd-a7ac-c7e7c54aa1f2?w=32&h=32&qlt=90&pcl=fffffa&o=6&pid=1.2" className="logo" />
                <div className="system-name">
                    NDB 書籍管理システム
                </div>
            </div>
        )
    }

    const renderInfos = () => {
        const { name, isLoggedIn } = userInfos;
        return isLoggedIn && (
            <div className="sub-infos-wrapper">
                <div className="username">
                    {name}
                </div>
                <div className="username">様、こんにちは！</div>
                <div 
                    className="logout"
                    onClick={onLogout}
                >
                    ログアウト
                </div>
            </div>
        )
    }


    return (
        <Header className="web-header">
            {renderMian()}
            {renderInfos()}
        </Header>
    )
}
export default WebHeader;