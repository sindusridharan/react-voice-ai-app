import React, { useState, useEffect } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import NewsCards from './components/NewsCards/NewsCards';
import useStyles from './styles';

import  { wordsToNumbers } from 'words-to-numbers';

const alanKey= 'b338f90826350b6c5f5322baa2e058232e956eca572e1d8b807a3e2338fdd0dc/stage';

const App = () => {
    const [newsArticles, setNewsArticles] = useState([]);
    const [activeArticle, setActiveArticle] = useState(-1);
    const classes = useStyles();

  useEffect(() => {
    alanBtn({
        key: alanKey,
        onCommand: ({command, articles, number}) =>{
            if(command === 'newHeadlines'){
               setNewsArticles(articles);
               setActiveArticle(-1);
            }else if(command === 'highlight'){
              setActiveArticle((prevActiveArticle) => prevActiveArticle+1)
            }else if (command === 'open'){
              const parsedNumber = number.length > 2 ? wordsToNumbers(number, {fuzzy: true}) : number;
              const article = articles[parsedNumber - 1];

              if(parsedNumber > 20){
                alanBtn().playText('Please Try that again.')
              }else if(article){
                window.open(article.url, '_blank');
                alanBtn().playText('Opening the article');
              }
              
            }
        }
    });
  }, []);

  return (
    <div>
      <div className={classes.logosContainer}>
          <img src="https://media-exp1.licdn.com/dms/image/C561BAQFzAiAvq0Jg8Q/company-background_10000/0?e=2159024400&v=beta&t=i8Vzn3GgAWe_h9ndpR4i1VhEStPK4_IW-IFVBijTbnk" className={classes.alanLogo} alt="alan logo"/>
      </div>
      <NewsCards articles={newsArticles}  activeArticle={activeArticle}/>
    </div>
  );
};

export default App;
