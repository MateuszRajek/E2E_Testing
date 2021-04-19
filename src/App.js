import { useState } from 'react';
import axios from 'axios';
import './App.css';

const apiKey = '73c7a7a317404135b7676593bb5489b2'

function App() {
  const [selectedNewsType, setSelectedNewsType] = useState('headlines')
  const [newsList, updateNewsList] = useState([])
  const [loadingStatus, setLoadingStatus] = useState(null)
  const [query, setQuery] = useState('')
  const [ dateFrom, setDateFrom ] = useState('');
  const [ dateTo, setDateTo ] = useState('');

  const getNews = event => {
    event.preventDefault()

    if (selectedNewsType === 'headlines') {
      axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`)
      .then(response => updateNewsList(response.data.articles))
      .catch(() => setLoadingStatus('error'))
    }

    if (selectedNewsType === 'everything') {
      axios.get(`https://newsapi.org/v2/everything?q=${query}&from=${dateFrom}&to=${dateTo}&apiKey=${apiKey}`)
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

       {
            selectedNewsType === 'everything' && (
              <>
                <label for="query">Insert query</label>
                <input
                  id="query"
                  placeholder="I.e. holidays"
                  data-testid="news-query"
                  type="text"
                  onChange={event => {setQuery(event.target.value)}}
                  // required="true"
                />
              
                <label for="date-from">Select starting date</label>
                <input
                  type="text"
                  pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                  placeholder="YYYY-MM-DD"
                  data-testid="news-date-from"
                  id="date-from"
                  value={dateFrom}
                  onChange={event => {setDateFrom(event.target.value)}}
                  // required="true"
                />

                <label for="date-to">Select starting date</label>
                <input
                  type="text"
                  pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                  placeholder="YYYY-MM-DD"
                  data-testid="news-date-to"
                  id="date-to"
                  value={dateTo}
                  onChange={event => {setDateTo(event.target.value)}}
                  // required="true"
                />
              </>
            )
          }

        {loadingStatus === 'error' && <div data-testid="news-error-alert" className="alert alert-danger">Couldn't fetch news data.</div>}

       <button
          className='btn btn-primary btn-get-news'
          type='submit'
          data-testid='get-news'
          disabled={selectedNewsType === 'everything' && query.length === 0 ? true : false}
       >
          Get News
       </button>
     </form>
   </section>

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
