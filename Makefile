serve:
	docker run -it --rm -v $$PWD:/app -p 5000:5000 ruphin/webdev serve
.PHONY: serve

shell:
	docker run -it --rm -v $$PWD:/app -p 5000:5000 ruphin/webdev shell
.PHONY: shell
