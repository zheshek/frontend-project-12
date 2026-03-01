
install:
	npm install
	cd frontend && npm install

build:
	cd frontend && npm run build

start:
	@echo "=== STARTING SERVER ==="
	@echo "Current directory: $$PWD"
	@echo "Node version: $$(node --version)"
	@echo "Setting execute permissions..."
	chmod +x node_modules/.bin/start-server 2>/dev/null || true
	chmod +x node_modules/@hexlet/chat-server/bin/start-server.js 2>/dev/null || true
	@echo "Starting server with npx..."
	npx --no-install start-server -s ./frontend/dist || (echo "❌ SERVER FAILED TO START" && exit 1)

dev:
	npx --no-install start-server -s ./frontend/dist &
	cd frontend && npm run dev

.PHONY: install build start dev