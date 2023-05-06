up: docker-up
down: docker-down
build: docker-build-up
restart: down up

docker-up:
	docker-compose up -d

docker-build-up:
	docker-compose up -d --build

docker-down:
	docker-compose down --remove-orphans