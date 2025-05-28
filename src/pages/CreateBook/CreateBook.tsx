import React from "react";
import BookEdit from "../../components/BookEdit";
import { useNavigate } from 'react-router-dom';

const CreateBook: React.FC = () => {
    const navigate = useNavigate();
    
    const renderTitle = () => {
        return (
            <div className="caption">
                書籍登録
            </div>
        )
    }

    const renderEdit = () => {
        return (
            <div className="book-edit-wrapper">
                <BookEdit 
                    mode="create" 
                    submit={{
                        url: 'http://127.0.0.1:8080/logged/book',
                        method: "POST",
                    }}
                    callback={()=>navigate(-1)}
                />
            </div>
        )
    }

    return (
        <section className="book-manager-createbook-container">
            {renderTitle()}
            {renderEdit()}
        </section>
    )
}
export default CreateBook;