ex_funcs = setValue getValue stringToUTF8 UTF8ToString lengthBytesUTF8
funcs := $(filter-out \#%,$(file < glpk_functions.txt))

noop=
space = $(noop) $(noop)
comma = ,
EXTRA_EXPORTED_RUNTIME_METHODS = EXTRA_EXPORTED_RUNTIME_METHODS=[$(subst $(space),$(comma),$(patsubst %,'%',$(ex_funcs)))]
EXPORTED_FUNCTIONS = EXPORTED_FUNCTIONS=[$(subst $(space),$(comma),$(patsubst %,'_%',$(funcs)))]


all:
	mkdir -p dist
	emcc -O3 \
		-s $(EXTRA_EXPORTED_RUNTIME_METHODS) \
		-s $(EXPORTED_FUNCTIONS) \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s MODULARIZE=1 \
		-s EXPORT_ES6=1 \
		-o dist/libglpk.js \
		$(GLPK_DIR)/src/.libs/libglpk.so
