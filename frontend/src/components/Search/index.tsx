
import { useEffect } from "react"
import { useIntl } from "react-intl"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { SearchLoupeIcon } from "../../icons/icons"
import routes from "../../routes"
import { closeCreatorsToggleList, tryToGetPersonByName } from "../../store/types/Search"

import './styles.sass'

const Search = () => {

    const dispatch = useDispatch()
    const intl = useIntl()

    const creators = useSelector( (state: any) => (state.search))
    
    const handleClick = (event: any) => {
        if (!event.target.className.includes('search-wrapper')) {
            dispatch( closeCreatorsToggleList() )
        }
    }

    useEffect( () => {
        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div
            className="search-wrapper"
        >
            <div
                className="search-wrapper__input-panel"
                style={{
                    borderRadius: creators.isOpened ? '15px 15px 0 0' : '15px',
                }}
            >
                <SearchLoupeIcon/>
                <input 
                    type='text'
                    onChange={event => dispatch( tryToGetPersonByName(event.target.value) )}
                    placeholder={ intl.formatMessage({ id: 'navbar_search_placeholder' }) }
                />
            </div>

            <div
                className={`${ creators.isOpened && 'opened-search-list' } search-wrapper__list-panel`}
                style={{
                    maxHeight: 
                        creators.isOpened
                        ?
                        (
                            creators.creatorsList.length>9
                            ?
                            '240px'
                            :
                            creators.creatorsList.length*28+'px'
                        )
                        :
                        '0px'
                }}
            >
                {
                    creators.creatorsList.map( (creator: any) => (
                        <Link
                            to={'/creator/'+creator.username}
                            key={creator}
                            className='search-wrapper__list-panel__person'
                            onClick={ () => dispatch(closeCreatorsToggleList())}
                        >
                            {
                                creator.username
                            }
                        </Link>
                    ))
                }
            </div>
        </div>  
    )
}

export default Search