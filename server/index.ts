import path from 'path';
import Koa from 'koa';
import Router from 'koa-router';
import koaStatic from 'koa-static';

import webpack from 'webpack';
import webpackConfig from '../build/webpack.dev.js';
import devMiddleware from './middleware/dev_middleware';
import hotMiddleware from './middleware/hot_middleware';
import hbsMiddleware from './middleware/hbs_middleware';

const compiler = webpack(webpackConfig);

const app = new Koa();
const router = new Router();

app.use(koaStatic(__dirname + '../public'));

app.use(devMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath // '/'
}));
app.use(hotMiddleware(compiler));

app.use(hbsMiddleware(path.join(__dirname, '../views')));

router.get('/', async (ctx, next) => {
    ctx.state.name = "123";
    ctx.state.title = "title";
    await ctx.render('home.hbs'); // 也可以使用 ctx.state 的数据
})

app.use(router.routes());
app.use(router.allowedMethods());

// 在端口3000监听:
app.listen(3006);
console.log('app started at port 3006...');