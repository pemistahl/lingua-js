/*
 * Copyright © 2023 Peter M. Stahl pemistahl@gmail.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getUint32Memory0();
    for (let i = 0; i < array.length; i++) {
        mem[ptr / 4 + i] = addHeapObject(array[i]);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
    if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}
/**
* This class detects the language of given input text.
*/
export class LanguageDetector {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(LanguageDetector.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_languagedetector_free(ptr);
    }
    /**
    * Detects the language of given input text.
    * If the language cannot be reliably detected, `undefined` is returned.
    * @param {string} text
    * @returns {string | undefined}
    */
    detectLanguageOf(text) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.languagedetector_detectLanguageOf(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v2;
            if (r0 !== 0) {
                v2 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1, 1);
            }
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Attempts to detect multiple languages in mixed-language text.
    *
    * This feature is experimental and under continuous development.
    *
    * An array of `DetectionResult` is returned containing an entry for each contiguous
    * single-language text section as identified by the library. Each entry consists
    * of the identified language, a start index and an end index. The indices denote
    * the substring that has been identified as a contiguous single-language text section.
    * @param {string} text
    * @returns {any}
    */
    detectMultipleLanguagesOf(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.languagedetector_detectMultipleLanguagesOf(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * Computes confidence values for each language supported by this detector for the given
    * input text. These values denote how likely it is that the given text has been written
    * in any of the languages supported by this detector.
    *
    * An array of two-element objects is returned containing those languages which the
    * calling instance of `LanguageDetector` has been built from, together with their
    * confidence values. The entries are sorted by their confidence value in descending order.
    * Each value is a probability between 0.0 and 1.0. The probabilities of all languages will
    * sum to 1.0. If the language is unambiguously identified by the rule engine, the value
    * 1.0 will always be returned for this language. The other languages will receive a value
    * of 0.0.
    * @param {string} text
    * @returns {any}
    */
    computeLanguageConfidenceValues(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.languagedetector_computeLanguageConfidenceValues(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * Computes the confidence value for the given language and input text. This value denotes
    * how likely it is that the given text has been written in the given language.
    *
    * The value that this method computes is a number between 0.0 and 1.0. If the language is
    * unambiguously identified by the rule engine, the value 1.0 will always be returned.
    * If the given language is not supported by this detector instance, the value 0.0 will
    * always be returned.
    * @param {string} text
    * @param {string} language
    * @returns {number}
    */
    computeLanguageConfidence(text, language) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(language, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            wasm.languagedetector_computeLanguageConfidence(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1);
            var r0 = getFloat64Memory0()[retptr / 8 + 0];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            return r0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
* This class configures and creates an instance of `LanguageDetector`.
*/
export class LanguageDetectorBuilder {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(LanguageDetectorBuilder.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_languagedetectorbuilder_free(ptr);
    }
    /**
    * Creates and returns an instance of `LanguageDetectorBuilder` with all built-in languages.
    * @returns {LanguageDetectorBuilder}
    */
    static fromAllLanguages() {
        const ret = wasm.languagedetectorbuilder_fromAllLanguages();
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
    * Creates and returns an instance of `LanguageDetectorBuilder`
    * with all built-in spoken languages.
    * @returns {LanguageDetectorBuilder}
    */
    static fromAllSpokenLanguages() {
        const ret = wasm.languagedetectorbuilder_fromAllSpokenLanguages();
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
    * Creates and returns an instance of `LanguageDetectorBuilder`
    * with all built-in languages supporting the Arabic script.
    * @returns {LanguageDetectorBuilder}
    */
    static fromAllLanguagesWithArabicScript() {
        const ret = wasm.languagedetectorbuilder_fromAllLanguagesWithArabicScript();
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
    * Creates and returns an instance of `LanguageDetectorBuilder`
    * with all built-in languages supporting the Cyrillic script.
    * @returns {LanguageDetectorBuilder}
    */
    static fromAllLanguagesWithCyrillicScript() {
        const ret = wasm.languagedetectorbuilder_fromAllLanguagesWithCyrillicScript();
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
    * Creates and returns an instance of `LanguageDetectorBuilder`
    * with all built-in languages supporting the Devanagari script.
    * @returns {LanguageDetectorBuilder}
    */
    static fromAllLanguagesWithDevanagariScript() {
        const ret = wasm.languagedetectorbuilder_fromAllLanguagesWithDevanagariScript();
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
    * Creates and returns an instance of `LanguageDetectorBuilder`
    * with all built-in languages supporting the Latin script.
    * @returns {LanguageDetectorBuilder}
    */
    static fromAllLanguagesWithLatinScript() {
        const ret = wasm.languagedetectorbuilder_fromAllLanguagesWithLatinScript();
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
    * Creates and returns an instance of `LanguageDetectorBuilder`
    * with all built-in languages except those specified in `languages`.
    *
    * ⚠ Throws an error if less than two `languages` are used to build
    * the `LanguageDetector`.
    * @param {...string[]} languages
    * @returns {LanguageDetectorBuilder}
    */
    static fromAllLanguagesWithout(...languages) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayJsValueToWasm0(languages, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.languagedetectorbuilder_fromAllLanguagesWithout(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return LanguageDetectorBuilder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Creates and returns an instance of `LanguageDetectorBuilder`
    * with the specified `languages`.
    *
    * ⚠ Throws an error if less than two `languages` are specified.
    * @param {...string[]} languages
    * @returns {LanguageDetectorBuilder}
    */
    static fromLanguages(...languages) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayJsValueToWasm0(languages, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.languagedetectorbuilder_fromLanguages(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return LanguageDetectorBuilder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Creates and returns an instance of `LanguageDetectorBuilder`
    * with the languages specified by the respective ISO 639-1 codes.
    *
    * ⚠ Throws an error if less than two `iso_codes` are specified.
    * @param {...string[]} isoCodes
    * @returns {LanguageDetectorBuilder}
    */
    static fromISOCodes6391(...isoCodes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayJsValueToWasm0(isoCodes, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.languagedetectorbuilder_fromISOCodes6391(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return LanguageDetectorBuilder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Creates and returns an instance of `LanguageDetectorBuilder`
    * with the languages specified by the respective ISO 639-3 codes.
    *
    * ⚠ Throws an error if less than two `iso_codes` are specified.
    * @param {...string[]} isoCodes
    * @returns {LanguageDetectorBuilder}
    */
    static fromISOCodes6393(...isoCodes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayJsValueToWasm0(isoCodes, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.languagedetectorbuilder_fromISOCodes6393(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return LanguageDetectorBuilder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Sets the desired value for the minimum relative distance measure.
    *
    * By default, *Lingua* returns the most likely language for a given
    * input text. However, there are certain words that are spelled the
    * same in more than one language. The word *prologue*, for instance,
    * is both a valid English and French word. Lingua would output either
    * English or French which might be wrong in the given context.
    * For cases like that, it is possible to specify a minimum relative
    * distance that the logarithmized and summed up probabilities for
    * each possible language have to satisfy.
    *
    * Be aware that the distance between the language probabilities is
    * dependent on the length of the input text. The longer the input
    * text, the larger the distance between the languages. So if you
    * want to classify very short text phrases, do not set the minimum
    * relative distance too high. Otherwise you will get most results
    * returned as `undefined` which is the return value for cases
    * where language detection is not reliably possible.
    *
    * ⚠ Throws an error if `distance` is smaller than 0.0 or greater than 0.99.
    * @param {number} distance
    * @returns {LanguageDetectorBuilder}
    */
    withMinimumRelativeDistance(distance) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.languagedetectorbuilder_withMinimumRelativeDistance(retptr, this.__wbg_ptr, distance);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return LanguageDetectorBuilder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Configures `LanguageDetectorBuilder` to preload all language models when creating
    * the instance of `LanguageDetector`.
    *
    * By default, *Lingua* uses lazy-loading to load only those language models
    * on demand which are considered relevant by the rule-based filter engine.
    * For web services, for instance, it is rather beneficial to preload all language
    * models into memory to avoid unexpected latency while waiting for the
    * service response. This method allows to switch between these two loading modes.
    * @returns {LanguageDetectorBuilder}
    */
    withPreloadedLanguageModels() {
        const ret = wasm.languagedetectorbuilder_withPreloadedLanguageModels(this.__wbg_ptr);
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
    * Disables the high accuracy mode in order to save memory and increase performance.
    *
    * By default, *Lingua's* high detection accuracy comes at the cost of loading large
    * language models into memory which might not be feasible for systems running low on
    * resources.
    *
    * This method disables the high accuracy mode so that only a small subset of language
    * models is loaded into memory. The downside of this approach is that detection accuracy
    * for short texts consisting of less than 120 characters will drop significantly. However,
    * detection accuracy for texts which are longer than 120 characters will remain mostly
    * unaffected.
    * @returns {LanguageDetectorBuilder}
    */
    withLowAccuracyMode() {
        const ret = wasm.languagedetectorbuilder_withLowAccuracyMode(this.__wbg_ptr);
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
    * Creates and returns the configured instance of `LanguageDetector`.
    * @returns {LanguageDetector}
    */
    build() {
        const ret = wasm.languagedetectorbuilder_build(this.__wbg_ptr);
        return LanguageDetector.__wrap(ret);
    }
}

export function __wbindgen_string_get(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbindgen_object_clone_ref(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};

export function __wbindgen_error_new(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbindgen_number_new(arg0) {
    const ret = arg0;
    return addHeapObject(ret);
};

export function __wbindgen_bigint_from_u64(arg0) {
    const ret = BigInt.asUintN(64, arg0);
    return addHeapObject(ret);
};

export function __wbg_set_8761474ad72b9bf1(arg0, arg1, arg2) {
    getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
};

export function __wbg_new_08236689f0afb357() {
    const ret = new Array();
    return addHeapObject(ret);
};

export function __wbg_new_c728d68b8b34487e() {
    const ret = new Object();
    return addHeapObject(ret);
};

export function __wbg_set_0ac78a2bc07da03c(arg0, arg1, arg2) {
    getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
};

export function __wbindgen_debug_string(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

