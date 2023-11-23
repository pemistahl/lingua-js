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

const { LanguageDetectorBuilder } = require("../node/lingua");

test("build from blacklist does not panic", () => {
  expect(() => LanguageDetectorBuilder.fromAllLanguagesWithout("Turkish", "Romanian")).not.toThrow();
});

test("build from whitelist does not panic", () => {
  expect(() => LanguageDetectorBuilder.fromLanguages("German", "English")).not.toThrow();
});

test("cannot build from whitelist", () => {
  expect(() => LanguageDetectorBuilder.fromLanguages("German")).toThrow(
    "LanguageDetector needs at least 2 languages to choose from");
});

test("build from ISO 639-1 codes does not panic", () => {
  expect(() => LanguageDetectorBuilder.fromISOCodes6391("DE", "SV")).not.toThrow();
});

test("cannot build from ISO 639-1 codes", () => {
  expect(() => LanguageDetectorBuilder.fromISOCodes6391("DE")).toThrow(
    "LanguageDetector needs at least 2 languages to choose from");
});

test("build from ISO 639-3 codes does not panic", () => {
  expect(() => LanguageDetectorBuilder.fromISOCodes6393("DEU", "SWE")).not.toThrow();
});

test("cannot build from ISO 639-3 codes", () => {
  expect(() => LanguageDetectorBuilder.fromISOCodes6391("DEU")).toThrow(
    "LanguageDetector needs at least 2 languages to choose from");
});

test("build with minimum relative distance does not panic", () => {
  expect(() => LanguageDetectorBuilder.fromAllLanguages().withMinimumRelativeDistance(0.2)).not.toThrow();
});

test.each([-0.01, -2.3, 1.0, 1.7])("cannot build with minimum relative distance %f", (distance) => {
  expect(() => LanguageDetectorBuilder.fromAllLanguages().withMinimumRelativeDistance(distance)).toThrow(
    "Minimum relative distance must lie in between 0.0 and 0.99");
});

test("build with low accuracy mode does not panic", () => {
  expect(() => LanguageDetectorBuilder.fromAllLanguages().withLowAccuracyMode()).not.toThrow();
});
