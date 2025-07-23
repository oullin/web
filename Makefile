SHELL := /bin/bash

.PHONY: format env-fresh lint-fix

format:
	npx prettier --write '**/*.{json,js,ts,tsx,jsx,mjs,cjs,vue,html}' --ignore-path .prettierignore

env-fresh:
	rm -rf node_modules
	rm package-lock.json
	npm cache clean --force
	npm install

lint-fix:
	npx eslint . --fix
