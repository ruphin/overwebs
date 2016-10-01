serve:
	docker run -it --rm -v $$PWD:/app -p 5000:5000 ruphin/webdev serve
.PHONY: serve

build:
	docker run -it --rm -v $$PWD:/app -p 5000:5000 ruphin/webdev
	docker build -t ruphin/overwebs .
	docker push ruphin/overwebs
.PHONY: build

shell:
	docker run -it --rm -v $$PWD:/app -p 5000:5000 ruphin/webdev shell
.PHONY: shell
