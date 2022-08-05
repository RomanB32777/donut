import axiosClient from '../../axiosClient'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import PageTitle from '../../commonComponents/PageTitle'
import { TronIcon } from '../../icons/icons'
import './styles.sass'

const titles = [
    'CREATOR',
    'DONATION',
    'USD',
    'DATE/TIME'
]

const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
]

const TransactionsContainer = () => {

    const [data, setData] = useState<any[]>([])
    const navigate = useNavigate()

    const user = useSelector( (state: any) => (state.user))

    const getData = async () => {
        if (user && user.username && user.username.length>0) {
            const res = await fetch(  '/api/user/get-transactions/'+user.username)
            if (res.status === 200) {
                const result = await res.json()
                setData(result)
            }
        }
    }

    const [tronUsdtKoef, setTronUsdtKoef] = useState<number>(0)

    const getPrice = async () => {
        const res: any = await axiosClient.get('https://www.binance.com/api/v3/ticker/price?symbol=TRXUSDT')
        setTronUsdtKoef(res.data.price)
    }

    useEffect(() => {
        getData()
        getPrice()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <div
            className='transactions-container'
        >
            <PageTitle
                formatId='page_title_transactions'
            />
            <div
                className='transactions-container__table'
            >
                {
                    (data && data.length > 0)
                    ?
                    <>
                        <div
                            className='transactions-container__table__header'
                        >
                            {
                                titles.map( (title, titleIndex) => (
                                    <span
                                        key={'transactions-container__table__header__panel' + titleIndex}
                                    >
                                        {
                                            title
                                        }
                                    </span>
                                ))
                            }
                        </div>
                        <div
                            className='transactions-container__table__main'
                        >
                            {
                                data.map( (row, rowIndex) => (
                                    <div
                                        key={'transactions-container__table__main__panel'+rowIndex}
                                        className='transactions-container__table__main__panel'
                                        onClick={ () => navigate('/creator/'+row.creator_username)}
                                    >
                                        <span>
                                            {
                                                row.creator_username
                                            }
                                        </span>
                                        <span>
                                            {
                                                row.sum_donation
                                            }
                                            <TronIcon/>
                                        </span>
                                        <span>
                                            { 
                                                '$ ' + Math.round( parseFloat(row.sum_donation)*tronUsdtKoef )
                                            }
                                        </span>
                                        <span>
                                        {
                                            months[parseInt(row.donation_date.slice(5,7))-1] + ' ' + row.donation_date.slice(8,10) + ' ' + row.donation_date.slice(0,4) + ' / ' + row.donation_date.slice(11,16)
                                        }
                                        </span>
                                    </div>
                                ))
                            }
                        </div>
                    </>
                    :
                    <span 
                        className='transactions-container__table__message'
                    >
                        <FormattedMessage id='transactions_page_no_transactions' />
                    </span>
                }

            </div>
        </div>
    )
}

export default TransactionsContainer