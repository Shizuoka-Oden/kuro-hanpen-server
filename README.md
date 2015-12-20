# kuro-hanpen-server

## Install

requires Node V4. 
Install serverless via npm.
```
npm install serverless -g
```

AWS 関連のアクセス情報設定ファイル作成

~/.aws/credentials
```
[default]
aws_access_key_id={YOUR_ACCESS_KEY}
aws_secret_access_key={YOUR_SECRET_KEY}
```

~/.aws/config:
```
[default]
region = ap-northeast-1
```

## Note
created by [serverless](https://github.com/serverless/serverless).
