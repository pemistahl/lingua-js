/* tslint:disable */
/* eslint-disable */
/**
* This class detects the language of given input text.
*/
export class LanguageDetector {
  free(): void;
/**
* Detects the language of given input text.
* If the language cannot be reliably detected, `undefined` is returned.
* @param {string} text
* @returns {string | undefined}
*/
  detectLanguageOf(text: string): string | undefined;
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
  detectMultipleLanguagesOf(text: string): any;
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
  computeLanguageConfidenceValues(text: string): any;
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
  computeLanguageConfidence(text: string, language: string): number;
}
/**
* This class configures and creates an instance of `LanguageDetector`.
*/
export class LanguageDetectorBuilder {
  free(): void;
/**
* Creates and returns an instance of `LanguageDetectorBuilder` with all built-in languages.
* @returns {LanguageDetectorBuilder}
*/
  static fromAllLanguages(): LanguageDetectorBuilder;
/**
* Creates and returns an instance of `LanguageDetectorBuilder`
* with all built-in spoken languages.
* @returns {LanguageDetectorBuilder}
*/
  static fromAllSpokenLanguages(): LanguageDetectorBuilder;
/**
* Creates and returns an instance of `LanguageDetectorBuilder`
* with all built-in languages supporting the Arabic script.
* @returns {LanguageDetectorBuilder}
*/
  static fromAllLanguagesWithArabicScript(): LanguageDetectorBuilder;
/**
* Creates and returns an instance of `LanguageDetectorBuilder`
* with all built-in languages supporting the Cyrillic script.
* @returns {LanguageDetectorBuilder}
*/
  static fromAllLanguagesWithCyrillicScript(): LanguageDetectorBuilder;
/**
* Creates and returns an instance of `LanguageDetectorBuilder`
* with all built-in languages supporting the Devanagari script.
* @returns {LanguageDetectorBuilder}
*/
  static fromAllLanguagesWithDevanagariScript(): LanguageDetectorBuilder;
/**
* Creates and returns an instance of `LanguageDetectorBuilder`
* with all built-in languages supporting the Latin script.
* @returns {LanguageDetectorBuilder}
*/
  static fromAllLanguagesWithLatinScript(): LanguageDetectorBuilder;
/**
* Creates and returns an instance of `LanguageDetectorBuilder`
* with all built-in languages except those specified in `languages`.
*
* ⚠ Throws an error if less than two `languages` are used to build
* the `LanguageDetector`.
* @param {...string[]} languages
* @returns {LanguageDetectorBuilder}
*/
  static fromAllLanguagesWithout(...languages: string[]): LanguageDetectorBuilder;
/**
* Creates and returns an instance of `LanguageDetectorBuilder`
* with the specified `languages`.
*
* ⚠ Throws an error if less than two `languages` are specified.
* @param {...string[]} languages
* @returns {LanguageDetectorBuilder}
*/
  static fromLanguages(...languages: string[]): LanguageDetectorBuilder;
/**
* Creates and returns an instance of `LanguageDetectorBuilder`
* with the languages specified by the respective ISO 639-1 codes.
*
* ⚠ Throws an error if less than two `iso_codes` are specified.
* @param {...string[]} isoCodes
* @returns {LanguageDetectorBuilder}
*/
  static fromISOCodes6391(...isoCodes: string[]): LanguageDetectorBuilder;
/**
* Creates and returns an instance of `LanguageDetectorBuilder`
* with the languages specified by the respective ISO 639-3 codes.
*
* ⚠ Throws an error if less than two `iso_codes` are specified.
* @param {...string[]} isoCodes
* @returns {LanguageDetectorBuilder}
*/
  static fromISOCodes6393(...isoCodes: string[]): LanguageDetectorBuilder;
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
  withMinimumRelativeDistance(distance: number): LanguageDetectorBuilder;
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
  withPreloadedLanguageModels(): LanguageDetectorBuilder;
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
  withLowAccuracyMode(): LanguageDetectorBuilder;
/**
* Creates and returns the configured instance of `LanguageDetector`.
* @returns {LanguageDetector}
*/
  build(): LanguageDetector;
}
