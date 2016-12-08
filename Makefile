dev:
	docker run -it --rm -v $$PWD:/app -p 5000:5000 ruphin/webdev gulp serve
.PHONY: development

production:
	ssh -t s.ruph.in ./overwebs.sh
.PHONY: production

shell:
	docker run -it --rm -v $$PWD:/app ruphin/webdev shell
.PHONY: shell
