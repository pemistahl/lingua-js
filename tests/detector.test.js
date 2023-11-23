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

const detectorForEnglishAndGerman = 
  LanguageDetectorBuilder
    .fromLanguages("English", "German")
    .withPreloadedLanguageModels()
    .build();

const detectorForAllLanguages =
  LanguageDetectorBuilder
    .fromAllLanguages()
    .withPreloadedLanguageModels()
    .build();

test("detect language", () => {
  expect(detectorForEnglishAndGerman.detectLanguageOf("Sprachen sind großartig")).toBe("German");
});

test("no language is returned", () => {
  expect(detectorForEnglishAndGerman.detectLanguageOf("проарплап")).toBeUndefined();
});

test("detect multiple languages for empty string", () => {
  expect(detectorForEnglishAndGerman.detectMultipleLanguagesOf("")).toEqual([]);
});

test.each([
  [
    "I'm really not sure whether multi-language detection is a good idea.",
    11,
    "English"
  ]
])("detect multiple languages with one language",
  (
    sentence,
    expectedWordCount,
    expectedLanguage
  ) => {
  const results = detectorForAllLanguages.detectMultipleLanguagesOf(sentence);
  expect(results.length).toBe(1);

  const result = results[0];
  const substring = sentence.slice(result.startIndex, result.endIndex);
  expect(substring).toBe(sentence);
  expect(result.wordCount).toBe(expectedWordCount);
  expect(result.language).toBe(expectedLanguage);
});

test.each([
  [
    '  He   turned around and asked: "Entschuldigen Sie, sprechen Sie Deutsch?"',
    "  He   turned around and asked: ",
    5,
    "English",
    '"Entschuldigen Sie, sprechen Sie Deutsch?"',
    5,
    "German"
  ],
  [
    "上海大学是一个好大学. It is such a great university.",
    "上海大学是一个好大学. ",
    10,
    "Chinese",
    "It is such a great university.",
    6,
    "English"
  ],
  [
    "English German French - Английский язык",
    "English German French - ",
    4,
    "English",
    "Английский язык",
    2,
    "Russian"
  ]
])("detect multiple languages with two languages", 
  (
    sentence, 
    expectedFirstSubstring, 
    expectedFirstWordCount, 
    expectedFirstLanguage, 
    expectedSecondSubstring, 
    expectedSecondWordCount, 
    expectedSecondLanguage
  ) => {
  const results = detectorForAllLanguages.detectMultipleLanguagesOf(sentence);
  expect(results.length).toBe(2);
      
  const firstResult = results[0];
  const firstSubstring = sentence.slice(firstResult.startIndex, firstResult.endIndex);
  expect(firstSubstring).toBe(expectedFirstSubstring);    
  expect(firstResult.wordCount).toBe(expectedFirstWordCount);
  expect(firstResult.language).toBe(expectedFirstLanguage);
      
  const secondResult = results[1];
  const secondSubstring = sentence.slice(secondResult.startIndex, secondResult.endIndex);
  expect(secondSubstring).toBe(expectedSecondSubstring);
  expect(secondResult.wordCount).toBe(expectedSecondWordCount);
  expect(secondResult.language).toBe(expectedSecondLanguage);
});

test.each([
  [
    "Parlez-vous français? Ich spreche Französisch nur ein bisschen. A little bit is better than nothing.",
    "Parlez-vous français? ",
    2,
    "French",
    "Ich spreche Französisch nur ein bisschen. ",
    6,
    "German",
    "A little bit is better than nothing.",
    7,
    "English"
  ],
  [
    "Płaszczowo-rurowe wymienniki ciepła Uszczelkowe der blaue himmel über berlin 中文 the quick brown fox jumps over the lazy dog",
    "Płaszczowo-rurowe wymienniki ciepła Uszczelkowe ",
    4,
    "Polish",
    "der blaue himmel über berlin 中文 ",
    7,
    "German",
    "the quick brown fox jumps over the lazy dog",
    9,
    "English"
  ]
])("detect multiple languages with three languages",
  (
    sentence,
    expectedFirstSubstring,
    expectedFirstWordCount,
    expectedFirstLanguage,
    expectedSecondSubstring,
    expectedSecondWordCount,
    expectedSecondLanguage,
    expectedThirdSubstring,
    expectedThirdWordCount,
    expectedThirdLanguage
  ) => {
  const results = detectorForAllLanguages.detectMultipleLanguagesOf(sentence);
  expect(results.length).toBe(3);

  const firstResult = results[0];
  const firstSubstring = sentence.slice(firstResult.startIndex, firstResult.endIndex);
  expect(firstSubstring).toBe(expectedFirstSubstring);
  expect(firstResult.wordCount).toBe(expectedFirstWordCount);
  expect(firstResult.language).toBe(expectedFirstLanguage);

  const secondResult = results[1];
  const secondSubstring = sentence.slice(secondResult.startIndex, secondResult.endIndex);
  expect(secondSubstring).toBe(expectedSecondSubstring);
  expect(secondResult.wordCount).toBe(expectedSecondWordCount);
  expect(secondResult.language).toBe(expectedSecondLanguage);

  const thirdResult = results[2];
  const thirdSubstring = sentence.slice(thirdResult.startIndex, thirdResult.endIndex);
  expect(thirdSubstring).toBe(expectedThirdSubstring);
  expect(thirdResult.wordCount).toBe(expectedThirdWordCount);
  expect(thirdResult.language).toBe(expectedThirdLanguage);
});

test.each([
  [
    "groß", 
    [
      {"language": "German", "value": 1.0}, 
      {"language": "English", "value": 0.0}
    ]
  ],
  [
    "Alter",
    [
      {"language": "German", "value": 0.68},
      {"language": "English", "value": 0.32}
    ]
  ],
  [
    "проарплап",
    [
      {"language": "English", "value": 0.0},
      {"language": "German", "value": 0.0}
    ]
  ]
])("compute language confidence values for word '%s'", (text, expectedConfidenceValues) => {
  const confidenceValues = detectorForEnglishAndGerman.computeLanguageConfidenceValues(text);
  expect(confidenceValues.length).toBe(2);
  
  const [first, second] = confidenceValues;
  const [expectedFirst, expectedSecond] = expectedConfidenceValues;
  
  expect(first.language).toBe(expectedFirst.language);
  expect(Number(first.value.toFixed(2))).toBe(expectedFirst.value);
  
  expect(second.language).toBe(expectedSecond.language);
  expect(Number(second.value.toFixed(2))).toBe(expectedSecond.value);
});

test.each([
  ["groß", 1.0, 0.0],
  ["Alter", 0.68, 0.32],
  ["проарплап", 0.0, 0.0]
])("compute language confidence for word '%s'", 
  (
    text, 
    expectedConfidenceForGerman, 
    expectedConfidenceForEnglish
  ) => {
  const confidenceForGerman = detectorForEnglishAndGerman.computeLanguageConfidence(text, "German");
  expect(Number(confidenceForGerman.toFixed(2))).toBe(expectedConfidenceForGerman);
  
  const confidenceForEnglish = detectorForEnglishAndGerman.computeLanguageConfidence(text, "English");
  expect(Number(confidenceForEnglish.toFixed(2))).toBe(expectedConfidenceForEnglish);
      
  const confidenceForFrench = detectorForEnglishAndGerman.computeLanguageConfidence(text, "French");
  expect(confidenceForFrench).toBe(0.0);
});
