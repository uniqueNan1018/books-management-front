import React from "react";
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import BookEdit from "../../components/BookEdit";

const EditBook: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const back = () => {
        navigate(-1);
    }

    const renderTitle = () => {
        return (
            <section>
                <div className="back" onClick={()=>back()}>
                    <ArrowLeftOutlined />
                    書籍検索に戻す
                </div>
                <div className="caption">
                    書籍編集
                </div>
            </section>
        )
    }

    const renderEdit = () => {
        return (
            <div className="book-edit-wrapper">
                <BookEdit
                    mode="edit"
                    id={id}
                    submitPath=""
                />
            </div>
        )
    }

    return (
        <section className="book-manager-editbook-container">
            {renderTitle()}
            {renderEdit()}
        </section>
    )
}
export default EditBook;