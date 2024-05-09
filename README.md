build
```
npm run build
docker build . -t ctnelson1997/cs571-su24-badgerauth-ui
docker push ctnelson1997/cs571-su24-badgerauth-ui
```


deploy
```
docker pull ctnelson1997/cs571-su24-badgerauth-ui
docker run --name=cs571_su24_badgerauth_ui  -d --restart=always -p 58843:80 ctnelson1997/cs571-su24-badgerauth-ui
```
