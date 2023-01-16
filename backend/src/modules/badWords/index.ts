import Filter from 'bad-words';
import words from './words.json' assert { type: "json" };

const badWordsFilter = new Filter({ list: words });

export default badWordsFilter;
