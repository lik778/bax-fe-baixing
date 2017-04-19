
build:
	docker build -t channel/baxfe .

run:
	docker run -p 3003:80 channel/baxfe

.PHONY: build, run
