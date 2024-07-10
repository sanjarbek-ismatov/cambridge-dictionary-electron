document.getElementById('search').addEventListener('input', async (event) => {
    const query = event.target.value;
    if (query.length > 2) {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
        const data = await response.json();
        displayResults(data);
    }
});

function displayResults(data) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    if (Array.isArray(data)) {
        data.forEach(entry => {
            const word = document.createElement('h2');
            word.textContent = entry.word;
            resultsContainer.appendChild(word);

            const pronunciations = document.createElement('div');
            pronunciations.classList.add('pronunciations');
            entry.phonetics.forEach(phonetic => {
                const audioContainer = document.createElement('div');
                audioContainer.classList.add('audio-container');
                
                if (phonetic.text) {
                    const phoneticText = document.createElement('p');
                    phoneticText.textContent = phonetic.text;
                    audioContainer.appendChild(phoneticText);
                }

                if (phonetic.audio) {
                    const audio = document.createElement('audio');
                    audio.controls = true;
                    audio.src = phonetic.audio;
                    audioContainer.appendChild(audio);
                }

                pronunciations.appendChild(audioContainer);
            });
            resultsContainer.appendChild(pronunciations);

            entry.meanings.forEach(meaning => {
                const partOfSpeech = document.createElement('h3');
                partOfSpeech.textContent = meaning.partOfSpeech;
                resultsContainer.appendChild(partOfSpeech);

                meaning.definitions.forEach(definition => {
                    const defContainer = document.createElement('div');
                    defContainer.classList.add('definition-container');

                    const def = document.createElement('p');
                    def.textContent = definition.definition;
                    defContainer.appendChild(def);

                    if (definition.example) {
                        const example = document.createElement('p');
                        example.textContent = `Example: ${definition.example}`;
                        example.classList.add('example');
                        defContainer.appendChild(example);
                    }

                    if (definition.synonyms && definition.synonyms.length > 0) {
                        const synonyms = document.createElement('p');
                        synonyms.textContent = `Synonyms: ${definition.synonyms.map(syn => `${syn} (${entry.word})`).join(', ')}`;
                        synonyms.classList.add('synonyms');
                        defContainer.appendChild(synonyms);
                    }

                    if (definition.antonyms && definition.antonyms.length > 0) {
                        const antonyms = document.createElement('p');
                        antonyms.textContent = `Antonyms: ${definition.antonyms.join(', ')}`;
                        antonyms.classList.add('antonyms');
                        defContainer.appendChild(antonyms);
                    }

                    resultsContainer.appendChild(defContainer);
                });
            });

            // Display 'See Also' recommendations (mocked for demonstration)
            // const seeAlso = document.createElement('p');
            // seeAlso.textContent = 'See also: word1, word2, word3';
            // seeAlso.classList.add('see-also');
            // resultsContainer.appendChild(seeAlso);
        });
    } else {
        const error = document.createElement('p');
        error.textContent = 'No results found';
        resultsContainer.appendChild(error);
    }
}
