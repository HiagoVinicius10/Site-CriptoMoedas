import { Link, useNavigate } from 'react-router-dom'
import styles from './home.module.css'
import { BsSearch } from 'react-icons/bs'
import { FormEvent, useEffect, useState } from 'react'

export interface CoinProps{
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  vwap24Hr: string;
  volumeUsd24h: string;
  rank: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  explorer:  string;
  changePercent24Hr: string;
  formatedPrice?: string;
  formatedMarket?: string;
  formatedVolume?: string;
}

interface DataProp{
  data: CoinProps[]
}

export function Home () {
  const [input, setInput] = useState('');
  const [coins, setCoins] = useState<CoinProps[]>([]);
  const [offSetCoins,setOffSetCoins] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    getData()
  }, [offSetCoins])

  async function getData () {
    fetch(`https://rest.coincap.io/v3/assets?limit=10&offset=${offSetCoins}&apiKey=f7cd0b99e74194e1b4a32a2373bccfdec7dfd983581aa1b0e88f2e8d4aa75ef2`)
    .then(response => response.json())
    .then((data: DataProp) => {
      const coinsData = data.data;

      const price = Intl.NumberFormat('en-US',{
        style: 'currency',
        currency: 'USD'
      })

      const priceCompact = Intl.NumberFormat('en-US',{
        style: 'currency',
        currency: 'USD',
        notation: 'compact'
      })

      const formatedResult = coinsData.map((item) =>{
        const formated = {
          ...item,
          formatedPrice: price.format(Number(item.priceUsd)),
          formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
          formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr))
        }

        return formated
      })
      
      const listaCoins = [...coins, ...formatedResult]
      setCoins(listaCoins)

    })
  }

  function handleSearch(e: FormEvent){
    e.preventDefault();

    if(input === '') return;

    navigate(`/detail/${input}`)
  }

  function handleGetMore(){
    if(offSetCoins === 0){
      setOffSetCoins(10)
      return;
    }

    setOffSetCoins( offSetCoins + 10)
  }

    return (
        <div>
            <main className={styles.container}>
                <form className={styles.form} onSubmit={handleSearch}>
                    <input
                    type="text"
                    placeholder="Digite o nome da moeda... EX bitcoin"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    />
                    <button type='submit'>
                        <BsSearch size={30} color='#fff'/>
                    </button>
                </form>

                <table>
                    <thead>
                       <tr>
                         <th scope='col'> Moeda </th>
                         <th scope='col'> Valor de mercado </th>
                         <th scope='col'> Preço </th>
                         <th scope='col'> Volume </th>
                         <th scope='col'> Mudança 24h </th>
                      </tr>
                    </thead>

                    <tbody id='tbody'>

                    {coins.length > 0 && coins.map((item) => (
                        <tr className={styles.tr} key={item.id}>

                        <td className={styles.tdLabel} data-label='Moeda'>
                          <div className={styles.name}>
                            <img 
                            className={styles.LogoCoins}
                            src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`}
                            alt='Logo das Moedas'

                            />

                          <Link to={`/detail/${item.id}`}> 
                          <span> {item.name} | {item.symbol} </span>
                          </Link>

                          </div>
                        </td>
  
                        <td className={styles.tdLabel} data-label='Valor de mercado'>
                          {item.formatedMarket}
                        </td>
  
                        <td className={styles.tdLabel} data-label='Preço'>
                          {item.formatedPrice}
                        </td>
  
                        <td className={styles.tdLabel} data-label='Volume'>
                          {item.formatedPrice}
                        </td>
  
                        <td className={Number(item.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss } data-label='Mudança 24h'>
                          <span> {Number(item.changePercent24Hr).toFixed(3)} </span>
                        </td>
                        
                          </tr>
                    ))}
                   
                    </tbody>
                </table>

                <button className={styles.buttonMore} onClick={handleGetMore}>
                  Buscar mais...
                </button>
            </main>         
        </div>
    )
}

