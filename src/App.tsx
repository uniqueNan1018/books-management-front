import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from "./pages/Login"
import BookList from './pages/BookList';
import CreateBook from './pages/CreateBook';
import EditBook from './pages/EditBook';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { store } from './store';
import jaJP from 'antd/es/locale/ja_JP';  // 日本語ローカライズをインポート

const App: React.FC = () => {
  return <Router>
    <ConfigProvider locale={jaJP}>
      <Provider store={store}>
        <Layout>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/booklist' element={<BookList />} />
            <Route path='/createbook' element={<CreateBook />} />
            <Route path='/editbook/:id' element={<EditBook />} />
          </Routes>
        </Layout>
      </Provider>
    </ConfigProvider>
  </Router>;
};

export default App;
