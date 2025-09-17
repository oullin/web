import fs from 'fs';
import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';

async function createServer() {
	const app = express();

	// Create Vite server in middleware mode.
	const vite = await createViteServer({
		server: { middlewareMode: true },
		appType: 'custom',
	});

	// Use vite's connect instance as middleware
	app.use(vite.middlewares);

	app.use('*', async (req, res, next) => {
		const url = req.originalUrl;

		try {
			// 1. Read index.html
			let template = fs.readFileSync(
				path.resolve(process.cwd(), 'index.html'),
				'utf-8',
			);

			// 2. Apply Vite HTML transforms.
			template = await vite.transformIndexHtml(url, template);

			// 3. Load the server entry.
			const { render } = await vite.ssrLoadModule('/src/entry-server.ts');

			// 4. render the app HTML.
			const { html: appHtml, initialState, ...headPayload } = await render(url);

			// 5. Inject the app-rendered HTML into the template.
			const html = template
				.replace(``, headPayload.headTags ?? '')
				.replace(``, appHtml)
				.replace(`''`, JSON.stringify(initialState));

			res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
		} catch (e) {
			vite.ssrFixStacktrace(e);
			next(e);
		}
	});

	app.listen(5173, () => {
		console.log('Dev server started at http://localhost:5173');
	});
}

createServer();
