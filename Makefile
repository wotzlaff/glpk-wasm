ex_funcs = setValue getValue stringToUTF8 UTF8ToString lengthBytesUTF8 FS addFunction removeFunction
noop=
space = $(noop) $(noop)
comma = ,
EXTRA_EXPORTED_RUNTIME_METHODS = EXTRA_EXPORTED_RUNTIME_METHODS=[$(subst $(space),$(comma),$(patsubst %,'%',$(ex_funcs)))]

all: prepare extract build

parts = min graph mip more full all

build: $(patsubst %,build-%,$(parts))

prepare:
	mkdir -p dist

extract:
	clang -Xclang -ast-dump=json -fsyntax-only $(GLPK_DIR)/src/glpk.h | node scripts/extract_functions.js

parts-min = problem simplex
parts-graph = graph-basic graph-optimization
parts-mip = $(parts-min) mip ios
parts-more = $(parts-mip) rw-data interior advanced-tableau
parts-full = $(parts-more) advanced-analysis advanced-basis basis env index rw-mathprog rw-solution scaling
parts-all = $(parts-full) npp undoc $(parts-graph) cnf

build-%:
	emcc -O3 \
		-s $(EXTRA_EXPORTED_RUNTIME_METHODS) \
		-s EXPORTED_FUNCTIONS=[$(subst $(space),$(comma),$(patsubst %,'_%',$(filter-out #%,$(foreach part,$(parts-$*),$(file < parts/$(part).txt))) free))] \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s ALLOW_TABLE_GROWTH=1 \
		-s MODULARIZE=1 \
		-o dist/glpk.$*.js \
		$(GLPK_DIR)/src/.libs/libglpk.so
