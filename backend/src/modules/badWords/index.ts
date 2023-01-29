import Filter from 'bad-words';
import words from './words.json' assert { type: 'json' };

const badWordsFilter = new Filter({ list: words });

const clean = (message: string) => {
  try {
    return badWordsFilter.clean(message);
  } catch (error) {
    return message;
  }
};

export { badWordsFilter, clean };
