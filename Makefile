ex_funcs = setValue getValue stringToUTF8 UTF8ToString lengthBytesUTF8 FS
noop=
space = $(noop) $(noop)
comma = ,
EXTRA_EXPORTED_RUNTIME_METHODS = EXTRA_EXPORTED_RUNTIME_METHODS=[$(subst $(space),$(comma),$(patsubst %,'%',$(ex_funcs)))]

all: prepare extract build

prepare:
	mkdir -p dist

extract:
	clang -Xclang -ast-dump=json -fsyntax-only $(GLPK_DIR)/src/glpk.h | node scripts/extract_functions.js

build:
	emcc -O3 \
		-s $(EXTRA_EXPORTED_RUNTIME_METHODS) \
		-s EXPORTED_FUNCTIONS=[$(subst $(space),$(comma),$(patsubst %,'_%',$(filter-out #%,$(file < exported-functions.txt)) free))] \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s MODULARIZE=1 \
		-o dist/libglpk.js \
		$(GLPK_DIR)/src/.libs/libglpk.so

dist/index.js:
	@echo "(function (root, factory) {if (typeof define === 'function' && define.amd) {define([], factory)} else if (typeof module === 'object' && module.exports) {module.exports = factory()} else {root.streamingPercentiles = factory()}}(typeof self !== 'undefined' ? self : this, function () {\n" > $@
	@cat dist/libglpk.js >> $@
	@echo "\nreturn Module}))" >> $@