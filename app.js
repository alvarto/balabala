const koa = require('koa'),
	serve = require('koa-static'),
	router = require('koa-router')(),
	body = require('koa-body'),
	jade = require('./middleware/jade'),
	preJade = require('./middleware/pre-jade'),
	errHandlr = require('./middleware/error-handlr');

const PORT = 3377;

var app = koa();

require('./middleware/global')(); // global

app.use(errHandlr) // error handling
	.use(require('./middleware/logger')) // logger
	.use(serve("./public/")) // static
	.use(body({})) // body parser
	.use(preJade) // header settings for html files
	.use(jade()) // jade support
	.use(router.routes()); // routes

router
	.get('/', require('./middleware/routes/index')) 
	.get('/output', require('./middleware/routes/output'))
	.get('/digest', require('./middleware/routes/digest'))
	.get('/digestall', require('./middleware/routes/digest-all'));

app.listen(PORT);
global.log("Listening on " + PORT);
