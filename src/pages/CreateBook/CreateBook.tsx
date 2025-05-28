import React from "react";
import BookEdit from "../../components/BookEdit";

const CreateBook: React.FC = () => {
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
                    submitPath="http://127.0.0.1:8080/logged/book"
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