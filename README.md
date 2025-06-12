# Books Management Front
これは、書籍管理システムのフロントエンドアプリケーションです。  
React（TypeScript）と Ant Design を使用し、React Router、Redux によるルーティングと状態管理を実現しています。

## 使用技術
- **React** + **TypeScript**
- **React Router DOM**（ルーティング）
- **Redux / React-Redux**（状態管理）
- **Ant Design**（UIライブラリ）
- **Ant Design 日本語ローカライズ**
- **Vite or CRA**（プロジェクト作成: Create React App を使用）

## ディレクトリ構成
```bash
books-management-front/
├── public/
├── src/
│ ├── components/
│ │ ├── CommFormItem.tsx # 共通フォームコンポーネント
│ │ ├── BookEdit.tsx # 書籍編集フォーム
│ │ ├── CategoryManage.tsx # カテゴリ管理（仮）
│ │ └── Layout/ # レイアウト関連（ヘッダー・サイドバー等）
│ ├── pages/
│ │ ├── Login.tsx # ログインページ
│ │ ├── BookList.tsx # 書籍一覧ページ
│ │ ├── CreateBook.tsx # 書籍登録ページ
│ │ └── EditBook.tsx # 書籍編集ページ
│ ├── stores/ # Redux ストア定義
│ ├── utils/ # 共通ユーティリティ
│ ├── App.tsx # アプリのエントリーポイント
│ ├── index.tsx # ルートレンダリング
│ ├── App.css # 全体スタイル
├── package.json
└── tsconfig.json

```
## セットアップ手順
1. 依存パッケージをインストール
```bash
npm install
```
2. アプリを起動
```bash
npm start
```
3. アクセス(ブラウザ上)
```bash
http://localhost:3000
```
### ルーティング一覧
| パス              | 説明           |
|-------------------|----------------|
| `/login`          | ログイン画面    |
| `/booklist`       | 書籍一覧画面    |
| `/createbook`     | 書籍作成画面    |
| `/editbook/:id`   | 書籍編集画面    |

## 主な依存ライブラリ
```json
"antd": "^5.x",
"react": "^18.x",
"react-dom": "^18.x",
"react-redux": "^8.x",
"react-router-dom": "^6.x",
"redux": "^4.x",
"typescript": "^5.x"
```

