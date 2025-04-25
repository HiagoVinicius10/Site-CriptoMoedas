import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {  CoinProps } from '../Home'
import styles from './detail.module.css'

interface ResponseData {
    data: CoinProps
}

interface ErrorData {
    error: string;
}

type DataProps = ResponseData | ErrorData;

export function Detail () {
    let {cripto} = useParams()
    let navigate = useNavigate()

    const [coin, setCoin] = useState<CoinProps>()
    const [loading, setLoading] = useState(true)

    useEffect(()=> {
     async function getCoin(){
        try{
           fetch(`https://rest.coincap.io/v3/assets/${cripto}?apiKey=f7cd0b99e74194e1b4a32a2373bccfdec7dfd983581aa1b0e88f2e8d4aa75ef2`)
           .then((response) => response.json())
           .then((data: DataProps) => {
            
            if('error' in data){
                navigate('/')
                return;
            }

        const price = Intl.NumberFormat('en-US',{
            style: 'currency',
            currency: 'USD'
        })

        const priceCompact = Intl.NumberFormat('en-US', {
            style:'currency',
            currency: 'USD',
            notation: 'compact'
        })

        const dataPontoData = data.data;

         const resultData = {
            ...dataPontoData,
            formatedPrice: price.format(Number(dataPontoData.priceUsd)),
            formatedMarket: priceCompact.format(Number(dataPontoData.marketCapUsd)),
            formatedVolume: priceCompact.format(Number(dataPontoData.volumeUsd24Hr))
         }

        setCoin(resultData)
         setLoading(false)
           })

        }catch(err){
            console.log(err)
            navigate('/')
        }
     }  

     getCoin();
    },[cripto])

    if(loading || !coin){
        return(
            <div className={styles.container}>
                <h4 className={styles.center}> Carregando detalhes... </h4>
            </div>
        )
    }
    return(
        <div className={styles.container}>
            <h1 className={styles.center}> {coin?.name} </h1>
            <h1 className={styles.center}> {coin?.symbol} </h1>

            <section className={styles.content}>
            <img src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`}
            alt="Logo das Moedas"
            className={styles.logo}
            />

            <h1>{coin?.name} | {coin?.symbol}</h1>

            <p><strong>Preço: </strong> {coin?.formatedPrice}</p>

            <a>
                <strong>Mercado: </strong> {coin?.formatedMarket}
            </a>

            <a>
                <strong>Volume: </strong> {coin?.formatedVolume}
            </a>

            <a>
                <strong>Mudança: </strong>
                 <span className={Number(coin?.changePercent24Hr) > 0 ? styles.profit : styles.loss }>
                {Number(coin?.changePercent24Hr).toFixed(3)}
                 </span>
            </a>
            </section>
        </div>
    )
}