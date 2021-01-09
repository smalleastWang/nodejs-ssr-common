
import consolidate from 'consolidate';
import handlebars from 'handlebars';
import handlebarsLayouts from 'handlebars-layouts';
import path from 'path';
import fs from 'fs';
import getPaths from 'get-paths';

const bigIntReplacer = () => {
    const seen = new WeakSet()
    return (key, value) => {
        if (typeof value === 'bigint') return value.toString()

        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return
            }
            seen.add(value)
        }

        return value
    }
}

export default function (
    pathDir, 
    { autoRender = true, extension = 'hbs', options = {}, debug = false } = {}
    ) {

    return function (ctx, next)  {
        function render(relPath, locals = {}) {
            return getPaths(pathDir, 'home', extension).then(paths => {

                // 模板数据
                const state = Object.assign({}, options, ctx.state || {}, locals);

                if (debug) console.log('渲染 `%s` 和 %s', paths.rel, JSON.stringify(state, bigIntReplacer()))
                
                ctx.type = 'text/html';

                handlebars.registerHelper(handlebarsLayouts(handlebars));
                
                const templateStr = fs.readFileSync(path.resolve(pathDir, paths.rel), 'utf8');
                
                handlebars.registerPartial('layout', fs.readFileSync(path.resolve(pathDir, 'partials/layout.hbs'), 'utf8'));
                handlebars.registerPartial('header', fs.readFileSync(path.resolve(pathDir, 'partials/header.hbs'), 'utf8'));
                handlebars.registerPartial('footer', fs.readFileSync(path.resolve(pathDir, 'partials/footer.hbs'), 'utf8'));
                
                const template = handlebars.compile(templateStr, state);
                const html = template(state);
                ctx.body = html;
                // const template = consolidate.handlebars;
                // return template(path.resolve(pathDir, paths.rel), state).then(html => {
                //     if (autoRender) {
                //         ctx.body = html;
                //     } else {
                //         return Promise.resolve(html)
                //     } 
                // });
            });
        }
        
        if (ctx.render) return next()

        ctx.render = render

        return next()

    }

}