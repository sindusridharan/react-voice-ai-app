// Use this sample to create your own voice commands
intent('what does this app do?', 'what can i do here?',
      reply('This is a news reader project'));

// 


const API_KEY = 'cd764056ee1243169a8d0fcf9086328a';
let savedArticles = [];

//Api end point for 'News by source'

intent('Give me the news from $(source* (.*))', (p) =>{
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}`;
    
    if(p.source.value){
        NEWS_API_URL = `${NEWS_API_URL}&sources=${p.source.value.toLowerCase().split(" ").join('-')}`
    }
    
    api.request(NEWS_API_URL, (error, response, body) =>{
        const { articles} = JSON.parse(body);
        
        if(!articles.length){
            p.play('Sorry, please try searching for news from a different source');
            return;
        }
        
        savedArticles = articles;
        
        p.play( {command: 'newHeadlines', articles});
        p.play(`Here are the (latest|recent) ${p.source.value}` );
        
        p.play('would you like me to read the headlines?');
        p.then(confirmation);
    });
})

//Api end point for 'News by Term'

intent('What\'s up with $(term* (.*))', (p) =>{
    let NEWS_API_URL = `https://newsapi.org/v2/everything?apiKey=${API_KEY}`;
    
    if(p.term.value){
        NEWS_API_URL = `${NEWS_API_URL}&q=${p.term.value}`
    }
    
    api.request(NEWS_API_URL, (error, response, body) =>{
        const { articles} = JSON.parse(body);
        
        if(!articles.length){
            p.play('Sorry, please try searching for news from something else');
            return;
        }
        
        savedArticles = articles;
        
        p.play( {command: 'newHeadlines', articles});
        p.play(`Here are the (latest|recent) articles on ${p.term.value}` );
        
         p.play('would you like me to read the headlines?');
        p.then(confirmation);
    });
})

//Api end point for 'News by Category'
const CATEGORIES = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technologies'];
const CATEGORIES_INTENT = `${CATEGORIES.map((category) =>`${category}~${category}`).join('|')}|`;

intent(`(show|what is|tell me|what's|what are|what're|read) (the|) (recent|latest) $(N news|headlines|articles) (in|about)`,
       `(read|show|get|bring me|give me) (the|) (recent|latest) $(C~${CATEGORIES_INTENT}) $(N news|headlines)`, (p) =>{
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}&country=nz`;
    
    if(p.C.value){
        NEWS_API_URL = `${NEWS_API_URL}&category=${p.C.value}`
    }
    
    api.request(NEWS_API_URL, (error, response, body) =>{
        const { articles} = JSON.parse(body);
        
        if(!articles.length){
            p.play('Sorry, please try searching for news a different category');
            return;
        }
        
        savedArticles = articles;
        
        p.play( {command: 'newHeadlines', articles});
        
         if(p.C.value){
        p.play(`Here are the (latest|recent) articles on ${p.C.value}` )
        } else{
            p.play(`Here are the (latest|recent) news` )
        }
        
        p.play('would you like me to read the headlines?');
        p.then(confirmation);
    });
})


const confirmation = context(() =>{
    intent('yes', async (p) =>{
        for(let i=0; i<savedArticles.length; i++){
            p.play({command: 'highlight', article: savedArticles[i]});
            p.play(`${savedArticles[i].title}`);
        }
    })
    intent('no', (p) =>{
        p.play('sure, sounds good to me')
    })
})

//implement logic for opening article

intent('open (the|) (article|) (number|) $(number* (.*))', (p) =>{
    if(p.number.value){
        p.play({command: 'open', number:p.number.value, articles: savedArticles})
    }
})


intent('(go|) back', (p) =>{
    p.play('Sure, going back');
    p.play({command: 'newHeadlines', articles: []})
})