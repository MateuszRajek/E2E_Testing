import { useState } from 'react';
import axios from 'axios';
import './App.css';

const apiKey = '73c7a7a317404135b7676593bb5489b2'

function App() {
  const [selectedNewsType, setSelectedNewsType] = useState('headlines')
  const [newsList, updateNewsList] = useState([])
  const [loadingStatus, setLoadingStatus] = useState(null)

  const getNews = event => {
    event.preventDefault()
    if (selectedNewsType === 'headlines') {
      axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`)
      .then(response => updateNewsList(response.data.articles))
      .catch(() => setLoadingStatus('error'))
    }
  }

  return (
   <>
   <section className='container'>
     <h1>Get latest news!</h1>
     <form onSubmit={getNews}>
       <div className='type-selection'>
         <label htmlFor='typeSelection'>Choose if you want to get headlines on custom selected news</label>
         <select 
            id='typeSelection' 
            data-testid='news-type-selection' 
            value={selectedNewsType} 
            onChange={event => setSelectedNewsType(event.target.value)}
         >
            <option value='headlines'>Headlines</option>
            <option value='everything'>Everything</option>
         </select>
       </div>
       <button
          className='btn btn-primary btn-get-news'
          type='submit'
          data-testid='get-news'
       >
          Get News
       </button>
     </form>
   </section>

   {loadingStatus === 'error' && <div data-testid="news-error-alert" className="alert alert-danger">Couldn't fetch news data.</div>}

   <section className='container news-container'>
      {newsList.map(news => {
        return (
          <div className='news' data-testid='news-element' key={news.title}>
            <h2>{news.title}</h2>
            <img 
              className='news-img' 
              data-testid='news-img' 
              alt={news.description}
              src={news.urlToImage ? news.urlToImage : 'https://via.placeholder.com/150'}
            />
          </div>
        )
      })}

   </section>
   </>
  );
}

export default App;
