THEME_DIR=themes/hansott

.PHONY: server build clean css

build: css
	hugo

css: $(THEME_DIR)/static/css/main.css

server: css
	hugo server --watch

clean:
	rm -rf public || true
	rm $(THEME_DIR)/static/css/main.css || true
	rm $(THEME_DIR)/src/icons/css/icons.css || true
	rm $(THEME_DIR)/static/fonts/* || true

$(THEME_DIR)/src/icons/css/icons.css:
	cd $(THEME_DIR)/src/icons && fontcustom compile

$(THEME_DIR)/src/css/custom.css: $(THEME_DIR)/src/scss/custom.scss
	mkdir -p $(@D)
	sassc $< $@

$(THEME_DIR)/static/css/main.css: \
$(THEME_DIR)/src/icons/css/icons.css \
$(THEME_DIR)/src/css/custom.css
	mkdir -p $(@D)
	mkdir -p $(THEME_DIR)/static/fonts
	cp -r $(THEME_DIR)/src/icons/fonts/. $(THEME_DIR)/static/fonts
	cat $^ | node_modules/.bin/csso --comments none | node_modules/.bin/postcss --use autoprefixer > $@
