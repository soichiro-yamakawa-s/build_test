Welcome to the 配当金一覧(分割併合調整) 
==================================================

This is 配当金一覧(分割併合調整) Web APP.


- Next.js
- React
- Redux
- ag-Grid

ファイル説明
-----------

* README.md - このファイルです。
* package.json - 依存関係などのメタデータが記載されています。npm(Node.jsのパッケージ管理ツール)が読み込むためのファイルです。
* package.lock.json - パッケージの依存関係が記載されたファイルです。依存しているモジュールが依存しているものも記載されます。npm install等を行った際に、自動で更新されます。手での修正はしません。このファイルはアプリケーションが依存しているモジュールが網羅的に記載されているため、ソースコードと常に同期をとる必要があります。
* app.setting.js - 各種定数等、アプリケーションで用いられるものが定義されています。
* next.config.js - next build時や開発時に読み込まれる設定ファイルです。
* api.js - データ取得用のAPIです。
* reducer.js - Reduxのreducerを定義しています。
* saga.js - 非同期処理や副作用を含むアクションが定義されています。
* server.js - ローカル端末で開発を行う際に起動するサーバです。
* pages/ - next.jsが使用するディレクトリです。@see [nextjs site](https://github.com/zeit/next.js). 
* components/ - コンポーネントファイル(JavaScript)が含まれます。
* muesapi/ - データ取得用のJSPファイルです。Muesサーバに配置されます。
* cache/ - 設定ファイル定期取得用のファイルです。共有サーバに配置されます。
* static/ - 静的ファイルです。next.jsでは静的ファイル用ディレクトリとしてstaticという名称を用います。
* tools/ - デプロイやデータ確認を行うためにツール群です。



Getting Started
---------------

1. Node.jsのインストール:

    配当金一覧(分割併合調整)では、Node.js環境上で開発を行います。次のダウンロードサイトからNode.js v10.13.0をダウンロードし、開発用端末にインストールしてください。

    https://nodejs.org/en/download/

    インストールが完了したら、cmd.exeを開き正しいバージョンがインストールされていることを確認してください。

    ```
    $ node -v
    v10.13.0
    $ npm -v
    6.4.1
    ```

2. リポジトリのクローン

    まずはじめに、開発用端末にGitのローカルリポジトリ作成するためのディレクトリを作成します。(ここでは、Cドライブ直下にrepositoriesディレクトリを作成します。任意のディレクトリで問題ありません)
    ```
    $ mkdir C:\repositories
    ```
    リポジトリ作成用のディレクトリに移動し、Gitリポジトリから最新のソースコードをクローンします。次のコマンドを実行してください。

    ```
    $ cd C:\repositories
    $ git clone https://quick.backlog.jp/git/QWS_TOPIX/dividend.git
    ```

    配当金一覧(分割併合調整)の開発本線であるdevelopブランチをチェックアウトします。

    ```
    $ cd dividend
    $ git checkout develop 
    ```

3. 依存モジュールのインストール:

    依存モジュールのインストールを行います。

    ```
    $ npm install
    ```

4. 開発用サーバの起動

    開発用サーバを起動します。
    
    ```
    $ npm run dev
    ```
    
    サーバが起動出来たら、http://localhost:3000 にアクセスし、アプリケーションが動作することを確認してください。

5. 開発時の構成について

    開発時は、開発用端末内にサーバを立てます。Webブラウザからのリクエストは次のような経路で問い合わされます。
    - JavaScript等の静的ファイル: client -> localhost(server.js) -> ローカルファイル
    - データ取得: client -> localhost(server.js) -> 実装者環境


6. ソースコードのビルド

    開発時には、動的に依存関係の解決やスクリプトの読み込みが行われています。Mues Webサーバに置くためには、これらを固定化し静的なファイルにする必要があります。

    次のコマンドを実行します。
    
    ```
    $ npm run build
    $ npm run export
    ```

    この手順によりoutというディレクトリができます。
    ここに出力されたファイルをMues Webサーバに置くことでアプリケーションの動作からデータ取得まで、全てMues上で動作する状態になります。

7. Mues環境上に設置する際の具体例

    最後にMues環境上に設置する際の具体例を示します。dev8の場合です。
    - muesapiディレクトリの配置先:
        - host: 172.30.0.73
        - dir: /home/nweb3/tomcat/webapps/qrx/WEB-INF/jsp/standard/bondweb/sample
        - jspファイルをsample配下に置く(sampleの下にmuesapiディレクトリではない)
    - outディレクトリの配置先:
        - host: 172.30.0.54
        - dir: /home/nweb2/htdocs/home/dev8/qrx/standard/bondweb/out
        - outディレクトリをbondweb配下にそのまま設置
    - アプリケーションのURL
        - http://11.255.97.43/home/dev8auth/bondweb/out/index.html

開発時のツール
------------
- Redux DevTolls

その他
---------
- AgGridのアイコンはbase64を書き込んでいるので書いておく

ラウンド機更新手順
---------------

1. developブランチのソースをプル(更新分なければ以下省略)

2. npm install

3. npm run build

4. npm run export

5. outフォルダーとmuesapiフォルダーをzipしてからそれぞれ下記6と7に配布する。(詳細コマンドunzip,mv,cp,rm等省略)

6. webサーバ(172.17.158.21 nweb2/quickadmin)
/usr/local/apache2/htdocs/qrlab/dividends/

8. apiサーバ(172.17.158.26 nweb2/quickadmin)
/home/nweb2/tomcat/webapps/qrx/WEB-INF/jsp/standard/dividends/api/

9. 配布後イメージ
Webサーバ
/usr/local/apache2/htdocs/qrlab/indices/
 ├　_next　（このなかにたくさん入っている）
 ├　404
 ├　index
 └　index.html
APIサーバ
/home/nweb2/tomcat/webapps/qrx/WEB-INF/jsp/standard/dividends/api/
 ├　dividendsCode.jsp
 └　dividendsGet.jsp


10. 画面確認
http://11.255.97.33/home/member/qrlab/dividends/index.html
