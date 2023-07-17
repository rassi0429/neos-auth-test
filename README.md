# neos-auth-test

rootにfirebaseのサービスアカウントのjsonを置いてください admin.jsonという名前で



staticにfirebaseconfig.jsを置いてください　firebaseconfig.jsは以下のような形式です

```
const firebaseConfig = {
    apiKey: "A...
    ...
    ...
};
```

## 仕組み
1. UserIdをバックエンドに送る
2. バックエンドでUserIdに認証コードを送る
3. フロントエンドで認証コードを入力する
4. バックエンドで認証コードを確認する
5. OKならバックエンドでフロント用のfirebase login tokenを生成する(firebase adminの力で userIdをfirebaseに渡して識別できるようにしておく)
6. フロントエンドでfirebase login tokenを使ってfirebaseにログインする